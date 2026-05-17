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
import { ROLES } from '../utils/auth/constants'
import {
  loginWithEmail,
  logout as firebaseLogout,
  registerWithEmail,
} from '../services/firestore/authService'
import { ensureUserProfile, getUserProfile } from '../services/firestore/userRepository'
import { logFirebaseAuth } from '../utils/firebaseDebug'
import {
  getAdvisorClients,
  getAdvisorRecord,
  getClientAdvisor,
  linkClientToAdvisor,
  unlinkClientFromAdvisor,
} from '../services/firestore/advisorRepository'
import { migrateLocalDataToFirestore } from '../services/firestore/migrationService'

const AUTH_INIT_TIMEOUT_MS = 8000

const AuthContext = createContext(null)

function buildFallbackProfile(firebaseUser) {
  return {
    uid: firebaseUser.uid,
    id: firebaseUser.uid,
    email: firebaseUser.email ?? '',
    role: ROLES.CLIENT,
    name: firebaseUser.email?.split('@')[0] ?? 'Usuario',
    advisorId: null,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [clients, setClients] = useState([])
  const [linkedAdvisor, setLinkedAdvisor] = useState(null)
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
        profile = await ensureUserProfile(firebaseUser, { role: ROLES.CLIENT })
      } catch (profileErr) {
        console.error('[Auth] Perfil Firestore no creado, usando datos de Auth:', profileErr)
        profile = buildFallbackProfile(firebaseUser)
      }
    }
    return profile
  }, [])

  const refreshAdvisorRelations = useCallback(async (profile) => {
    if (!profile || !isFirebaseReady()) return
    const uid = profile.uid ?? profile.id

    if (profile.role === ROLES.CLIENT) {
      const advisor = await getClientAdvisor(uid)
      setLinkedAdvisor(advisor)
      setClients([])
    } else if (profile.role === ROLES.ADVISOR) {
      const record = await getAdvisorRecord(uid)
      setUser((prev) => ({ ...(prev ?? profile), ...profile, advisorKey: record?.advisorKey }))
      const list = await getAdvisorClients(uid)
      setClients(list)
      setLinkedAdvisor(null)
    }
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
          setClients([])
          setLinkedAdvisor(null)
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
        refreshAdvisorRelations(profile).catch((err) => {
          console.error('[Auth] Relaciones asesor:', err)
        })
      } catch (err) {
        console.error('[Firebase Auth] Error al cargar sesión:', err)
        setUser(null)
        setClients([])
        setLinkedAdvisor(null)
        finishAuthInit()
      }
    })

    return () => {
      cancelled = true
      clearTimeout(safetyTimeout)
      unsubscribe()
    }
  }, [finishAuthInit, refreshAdvisorRelations, resolveSessionProfile])

  const login = useCallback(
    async ({ email, password }) => {
      const fbUser = await loginWithEmail({ email, password })
      const profile = await resolveSessionProfile(fbUser)
      setUser(profile)
      await refreshAdvisorRelations(profile)
      return profile
    },
    [resolveSessionProfile, refreshAdvisorRelations],
  )

  const register = useCallback(
    async (payload) => {
      const profile = await registerWithEmail({
        ...payload,
        role: payload.role ?? ROLES.CLIENT,
      })
      setUser(profile)
      await refreshAdvisorRelations(profile)
      return profile
    },
    [refreshAdvisorRelations],
  )

  const logout = useCallback(async () => {
    await firebaseLogout()
    setUser(null)
    setClients([])
    setLinkedAdvisor(null)
  }, [])

  const reloadUser = useCallback(async () => {
    if (!user) return null
    const uid = user.uid ?? user.id
    const profile = await getUserProfile(uid)
    if (profile) {
      setUser(profile)
      await refreshAdvisorRelations(profile)
      return profile
    }
    return null
  }, [user, refreshAdvisorRelations])

  const linkAdvisor = useCallback(
    async ({ advisorKey, advisorEmail }) => {
      if (!user || user.role !== ROLES.CLIENT) {
        throw new Error('Solo los clientes pueden vincular un asesor.')
      }
      const uid = user.uid ?? user.id
      const result = await linkClientToAdvisor(uid, { advisorKey, advisorEmail })
      await reloadUser()
      return result
    },
    [user, reloadUser],
  )

  const unlinkAdvisor = useCallback(async () => {
    if (!user || user.role !== ROLES.CLIENT) return
    const uid = user.uid ?? user.id
    await unlinkClientFromAdvisor(uid)
    await reloadUser()
  }, [user, reloadUser])

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
      isClient: user?.role === ROLES.CLIENT,
      isAdvisor: user?.role === ROLES.ADVISOR,
      login,
      register,
      logout,
      reloadUser,
      linkAdvisor,
      unlinkAdvisor,
      linkedAdvisor,
      clients,
    }),
    [
      user,
      authLoading,
      firebaseConfigError,
      login,
      register,
      logout,
      reloadUser,
      linkAdvisor,
      unlinkAdvisor,
      linkedAdvisor,
      clients,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
