import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore'
import { db, isFirebaseReady } from '../../firebase'
import { COLLECTIONS } from './collections'
import { ROLES } from '../../utils/auth/constants'

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

export async function createUserProfile({ uid, email, role, name }) {
  const profile = {
    uid,
    email: String(email).trim().toLowerCase(),
    role,
    name: name?.trim() || email.split('@')[0],
    advisorId: null,
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
    role: defaults.role ?? ROLES.CLIENT,
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

export async function findAdvisorByEmail(email) {
  const normalized = String(email).trim().toLowerCase()
  const q = query(
    collection(db, COLLECTIONS.users),
    where('role', '==', ROLES.ADVISOR),
    where('email', '==', normalized),
  )
  const snap = await getDocs(q)
  if (snap.empty) return null
  return mapUserDoc(snap.docs[0].data())
}

export async function getUsersByIds(uids) {
  const results = await Promise.all(uids.map((uid) => getUserProfile(uid)))
  return results.filter(Boolean)
}
