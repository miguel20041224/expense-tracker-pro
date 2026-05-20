import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, firebaseInitError, getFirebaseConsoleAuthUrl, isFirebaseReady } from '../firebase'
import {
  loginWithEmail,
  logout as firebaseLogout,
  registerWithEmail,
} from '../services/firestore/authService'
import { ensureUserProfile, getUserProfile } from '../services/firestore/userRepository'
import { logFirebaseAuth } from '../utils/firebaseDebug'
import { migrateLocalDataToFirestore } from '../services/firestore/migrationService'

const AUTH_INIT_TIMEOUT_MS = 8000

const AuthContext = createContext(null)

function buildFallbackProfile(firebaseUser) {
  return {
    uid: firebaseUser.uid,
    id: firebaseUser.uid,
    email: firebaseUser.email ?? '',
    name: firebaseUser.email?.split('@')[0] ?? 'Usuario',
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const initialAuthResolved = useRef(false)

  const finishAuthInit = useCallback(() => {
    if (!initialAuthResolved.current) {
      initialAuthResolved.current = true
      setAuthLoading(false)
      if (import.meta.env.DEV) {
        console.log('[App] Auth init complete')
      }
    }
  }, [])

  const resolveSessionProfile = useCallback(async (firebaseUser) => {
    let profile = await getUserProfile(firebaseUser.uid)
    if (!profile) {
      logFirebaseAuth('session:creating-firestore-profile', { uid: firebaseUser.uid })
      try {
        profile = await ensureUserProfile(firebaseUser)
      } catch (profileErr) {
        console.error('[Auth] Perfil Firestore no creado, usando datos de Auth:', profileErr)
        profile = buildFallbackProfile(firebaseUser)
      }
    }
    return profile
  }, [])

  useEffect(() => {
    let cancelled = false

    if (!isFirebaseReady() || !auth) {
      console.warn('[Auth] Firebase no disponible:', firebaseInitError?.message ?? 'sin auth')
      finishAuthInit()
      return undefined
    }

    const safetyTimeout = setTimeout(() => {
      if (!cancelled && !initialAuthResolved.current) {
        console.warn('[Auth] Timeout esperando sesión; mostrando UI.')
        finishAuthInit()
      }
    }, AUTH_INIT_TIMEOUT_MS)

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (cancelled) return

      try {
        if (!firebaseUser) {
          logFirebaseAuth('session:none')
          setUser(null)
          finishAuthInit()
          return
        }

        logFirebaseAuth('session:active', { uid: firebaseUser.uid, email: firebaseUser.email })

        const profile = await resolveSessionProfile(firebaseUser)
        setUser(profile)
        finishAuthInit()

        migrateLocalDataToFirestore(firebaseUser.uid).catch((err) => {
          console.error('[Auth] Migración local:', err)
        })
      } catch (err) {
        console.error('[Firebase Auth] Error al cargar sesión:', err)
        setUser(null)
        finishAuthInit()
      }
    })

    return () => {
      cancelled = true
      clearTimeout(safetyTimeout)
      unsubscribe()
    }
  }, [finishAuthInit, resolveSessionProfile])

  const login = useCallback(
    async ({ email, password }) => {
      const fbUser = await loginWithEmail({ email, password })
      const profile = await resolveSessionProfile(fbUser)
      setUser(profile)
      return profile
    },
    [resolveSessionProfile],
  )

  const register = useCallback(async (payload) => {
    const profile = await registerWithEmail(payload)
    setUser(profile)
    return profile
  }, [])

  const logout = useCallback(async () => {
    await firebaseLogout()
    setUser(null)
  }, [])

  const reloadUser = useCallback(async () => {
    if (!user) return null
    const uid = user.uid ?? user.id
    const profile = await getUserProfile(uid)
    if (profile) {
      setUser(profile)
      return profile
    }
    return null
  }, [user])

  const firebaseConfigError = useMemo(() => {
    if (firebaseInitError?.message) return firebaseInitError.message
    if (!isFirebaseReady()) {
      return 'Firebase no está inicializado. La app funciona en modo limitado.'
    }
    return null
  }, [])

  const value = useMemo(
    () => ({
      user,
      authLoading,
      firebaseReady: isFirebaseReady(),
      firebaseConfigError,
      firebaseConsoleAuthUrl: getFirebaseConsoleAuthUrl(),
      login,
      register,
      logout,
      reloadUser,
    }),
    [user, authLoading, firebaseConfigError, login, register, logout, reloadUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
