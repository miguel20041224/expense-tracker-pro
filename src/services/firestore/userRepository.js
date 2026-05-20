import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db, isFirebaseReady } from '../../firebase'
import { COLLECTIONS } from './collections'

function usersRef(uid) {
  if (!isFirebaseReady() || !db) {
    throw new Error('Firestore no está disponible. Revisa src/config/firebase.config.js.')
  }
  return doc(db, COLLECTIONS.users, uid)
}

export function mapUserDoc(data) {
  if (!data) return null
  const uid = data.uid ?? data.id
  return {
    ...data,
    uid,
    id: uid,
  }
}

export async function getUserProfile(uid) {
  const snap = await getDoc(usersRef(uid))
  if (!snap.exists()) return null
  return mapUserDoc(snap.data())
}

export async function createUserProfile({ uid, email, name }) {
  const profile = {
    uid,
    email: String(email).trim().toLowerCase(),
    name: name?.trim() || email.split('@')[0],
    createdAt: new Date().toISOString(),
  }
  await setDoc(usersRef(uid), profile)
  return mapUserDoc(profile)
}

/** Crea el documento en Firestore si el usuario existe en Auth pero no tiene perfil. */
export async function ensureUserProfile(firebaseUser, defaults = {}) {
  const uid = firebaseUser.uid
  const existing = await getUserProfile(uid)
  if (existing) return existing

  return createUserProfile({
    uid,
    email: firebaseUser.email ?? defaults.email ?? '',
    name:
      defaults.name ??
      firebaseUser.displayName ??
      firebaseUser.email?.split('@')[0] ??
      'Usuario',
  })
}

export async function updateUserProfile(uid, partial) {
  await setDoc(usersRef(uid), partial, { merge: true })
  return getUserProfile(uid)
}
