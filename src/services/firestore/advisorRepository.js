import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  setDoc,
  where,
} from 'firebase/firestore'
import { db, isFirebaseReady } from '../../firebase'
import { COLLECTIONS } from './collections'
import { MAX_ADVISOR_CLIENTS, ROLES } from '../../utils/auth/constants'
import { getUserProfile, mapUserDoc, updateUserProfile } from './userRepository'

function advisorsRef(uid) {
  if (!isFirebaseReady() || !db) {
    throw new Error('Firestore no está disponible. Revisa src/config/firebase.config.js.')
  }
  return doc(db, COLLECTIONS.advisors, uid)
}

function generateAdvisorKey() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 8; i += 1) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export async function createAdvisorRecord({ uid, email, name }) {
  const advisorKey = generateAdvisorKey()
  const record = {
    uid,
    email: String(email).trim().toLowerCase(),
    name: name?.trim() || email.split('@')[0],
    advisorKey,
    clients: [],
    createdAt: new Date().toISOString(),
  }
  await setDoc(advisorsRef(uid), record)
  return record
}

export async function getAdvisorRecord(uid) {
  const snap = await getDoc(advisorsRef(uid))
  if (!snap.exists()) return null
  return snap.data()
}

export async function findAdvisorByKey(advisorKey) {
  const key = String(advisorKey ?? '').trim().toUpperCase()
  if (!key) return null

  const q = query(
    collection(db, COLLECTIONS.advisors),
    where('advisorKey', '==', key),
  )
  const snap = await getDocs(q)
  if (snap.empty) return null

  const advisorData = snap.docs[0].data()
  const profile = await getUserProfile(advisorData.uid)
  return profile ? { ...profile, advisorKey: advisorData.advisorKey } : null
}

export async function getAdvisorClients(advisorUid) {
  const advisor = await getAdvisorRecord(advisorUid)
  if (!advisor?.clients?.length) return []

  const profiles = await Promise.all(
    advisor.clients.map(async (clientUid) => {
      const client = await getUserProfile(clientUid)
      if (!client || client.role !== ROLES.CLIENT) return null
      if (client.advisorId !== advisorUid) return null
      return client
    }),
  )
  return profiles.filter(Boolean)
}

export async function linkClientToAdvisor(clientUid, { advisorKey, advisorEmail }) {
  let advisor = null
  const key = String(advisorKey ?? '').trim()
  const mail = String(advisorEmail ?? '').trim().toLowerCase()

  if (key) {
    advisor = await findAdvisorByKey(key)
  } else if (mail) {
    const q = query(
      collection(db, COLLECTIONS.users),
      where('role', '==', ROLES.ADVISOR),
      where('email', '==', mail),
    )
    const snap = await getDocs(q)
    if (!snap.empty) advisor = mapUserDoc(snap.docs[0].data())
  }

  if (!advisor) throw new Error('No se encontró un asesor con ese código o correo.')
  if (clientUid === advisor.uid) throw new Error('No puedes vincularte a ti mismo.')

  const advisorRecord = await getAdvisorRecord(advisor.uid)
  if (!advisorRecord) throw new Error('Perfil de asesor no encontrado.')

  const activeClients = (advisorRecord.clients ?? []).filter(Boolean)
  const alreadyLinked = activeClients.includes(clientUid)

  if (!alreadyLinked && activeClients.length >= MAX_ADVISOR_CLIENTS) {
    throw new Error(`El asesor ya tiene el máximo de ${MAX_ADVISOR_CLIENTS} clientes activos.`)
  }

  const client = await getUserProfile(clientUid)
  if (!client || client.role !== ROLES.CLIENT) {
    throw new Error('Cliente no encontrado.')
  }

  if (client.advisorId && client.advisorId !== advisor.uid) {
    await unlinkClientFromAdvisor(clientUid)
  }

  await runTransaction(db, async (transaction) => {
    const clientRef = doc(db, COLLECTIONS.users, clientUid)
    const advisorRef = advisorsRef(advisor.uid)
    const advisorSnap = await transaction.get(advisorRef)

    const clients = advisorSnap.exists() ? [...(advisorSnap.data().clients ?? [])] : []
    if (!clients.includes(clientUid)) {
      if (clients.length >= MAX_ADVISOR_CLIENTS) {
        throw new Error(`El asesor ya tiene el máximo de ${MAX_ADVISOR_CLIENTS} clientes activos.`)
      }
      clients.push(clientUid)
    }

    transaction.set(clientRef, { advisorId: advisor.uid }, { merge: true })
    transaction.set(advisorRef, { clients }, { merge: true })
  })

  return {
    client: await getUserProfile(clientUid),
    advisor: await getAdvisorRecord(advisor.uid),
  }
}

export async function unlinkClientFromAdvisor(clientUid) {
  const client = await getUserProfile(clientUid)
  if (!client?.advisorId) return client

  const advisorUid = client.advisorId

  await runTransaction(db, async (transaction) => {
    const clientRef = doc(db, COLLECTIONS.users, clientUid)
    const advisorRef = advisorsRef(advisorUid)
    const advisorSnap = await transaction.get(advisorRef)

    transaction.set(clientRef, { advisorId: null }, { merge: true })

    if (advisorSnap.exists()) {
      const clients = (advisorSnap.data().clients ?? []).filter((id) => id !== clientUid)
      transaction.set(advisorRef, { clients }, { merge: true })
    }
  })

  return updateUserProfile(clientUid, { advisorId: null })
}

export async function getClientAdvisor(clientUid) {
  const client = await getUserProfile(clientUid)
  if (!client?.advisorId) return null
  const advisor = await getUserProfile(client.advisorId)
  const record = await getAdvisorRecord(client.advisorId)
  if (!advisor) return null
  return { ...advisor, advisorKey: record?.advisorKey }
}
