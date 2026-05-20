import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth, firebaseInitError, isFirebaseReady } from '../../firebase'
import { logFirebaseAuth } from '../../utils/firebaseDebug'
import { mapFirebaseAuthError, mapFirestoreError } from '../../utils/auth/firebaseErrors'
import { createUserProfile } from './userRepository'
import { ensureFinancialDataDoc } from './financialDataRepository'
import { migrateLocalDataToFirestore } from './migrationService'

function requireAuth() {
  if (!isFirebaseReady() || !auth) {
    throw new Error(
      firebaseInitError?.message ??
        'Firebase no está disponible. Revisa src/config/firebase.config.js.',
    )
  }
  return auth
}

export async function registerWithEmail({ name, email, password }) {
  const normalizedEmail = String(email).trim().toLowerCase()
  if (!normalizedEmail) throw new Error('El correo es obligatorio.')

  logFirebaseAuth('register:start', { email: normalizedEmail })

  let credential = null
  try {
    credential = await createUserWithEmailAndPassword(
      requireAuth(),
      normalizedEmail,
      password,
    )
    const { uid } = credential.user
    logFirebaseAuth('register:auth-ok', { uid })

    const profile = await createUserProfile({
      uid,
      email: normalizedEmail,
      name,
    })
    logFirebaseAuth('register:firestore-user', { uid })

    await ensureFinancialDataDoc(uid)
    migrateLocalDataToFirestore(uid).catch((err) => {
      console.error('[Auth] Migración en registro:', err)
    })
    logFirebaseAuth('register:complete', { uid })

    return profile
  } catch (error) {
    if (credential?.user) {
      await deleteUser(credential.user).catch(() => {})
    }
    if (error?.code?.startsWith?.('auth/')) {
      throw mapFirebaseAuthError(error)
    }
    throw mapFirestoreError(error)
  }
}

export async function loginWithEmail({ email, password }) {
  const normalizedEmail = String(email).trim().toLowerCase()
  logFirebaseAuth('login:start', { email: normalizedEmail })

  try {
    const credential = await signInWithEmailAndPassword(requireAuth(), normalizedEmail, password)
    logFirebaseAuth('login:ok', { uid: credential.user.uid })
    migrateLocalDataToFirestore(credential.user.uid).catch((err) => {
      console.error('[Auth] Migración en login:', err)
    })
    return credential.user
  } catch (error) {
    throw mapFirebaseAuthError(error)
  }
}

export async function logout() {
  if (!isFirebaseReady() || !auth) return
  logFirebaseAuth('logout')
  await signOut(auth)
}
