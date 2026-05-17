import { readStorage, writeStorage } from '../storage'
import { createTransactionId } from '../movements'
import { hashPassword, verifyPassword } from './password'
import {
  MAX_ADVISOR_CLIENTS,
  ROLES,
  SESSION_STORAGE_KEY,
  USERS_STORAGE_KEY,
} from './constants'
import { migrateLegacyFinanceDataToUser } from './migrateLegacyData'

function generateAdvisorKey() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 8; i += 1) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

function readUsers() {
  return readStorage(USERS_STORAGE_KEY, [])
}

function writeUsers(users) {
  writeStorage(USERS_STORAGE_KEY, users)
}

function normalizeEmail(email) {
  return String(email ?? '').trim().toLowerCase()
}

export function getUserById(id) {
  return readUsers().find((u) => u.id === id) ?? null
}

export function getUserByEmail(email) {
  const normalized = normalizeEmail(email)
  return readUsers().find((u) => normalizeEmail(u.email) === normalized) ?? null
}

export function getAdvisorByKey(advisorKey) {
  const key = String(advisorKey ?? '').trim().toUpperCase()
  if (!key) return null
  return (
    readUsers().find(
      (u) => u.role === ROLES.ADVISOR && String(u.advisorKey).toUpperCase() === key,
    ) ?? null
  )
}

export function getSessionUserId() {
  return readStorage(SESSION_STORAGE_KEY, null)
}

export function setSessionUserId(userId) {
  if (userId) writeStorage(SESSION_STORAGE_KEY, userId)
  else localStorage.removeItem(SESSION_STORAGE_KEY)
}

export function getSessionUser() {
  const id = getSessionUserId()
  return id ? getUserById(id) : null
}

export function registerUser({ name, email, password, role }) {
  const normalizedEmail = normalizeEmail(email)
  if (!normalizedEmail) throw new Error('El correo es obligatorio.')
  if (!password || String(password).length < 4) {
    throw new Error('La contraseña debe tener al menos 4 caracteres.')
  }
  if (![ROLES.CLIENT, ROLES.ADVISOR].includes(role)) {
    throw new Error('Rol no válido.')
  }

  const users = readUsers()
  if (users.some((u) => normalizeEmail(u.email) === normalizedEmail)) {
    throw new Error('Ya existe una cuenta con este correo.')
  }

  const user = {
    id: createTransactionId(),
    role,
    email: normalizedEmail,
    name: String(name ?? '').trim() || normalizedEmail.split('@')[0],
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
    advisorId: null,
    ...(role === ROLES.ADVISOR
      ? { advisorKey: generateAdvisorKey(), clientIds: [] }
      : {}),
  }

  users.push(user)
  writeUsers(users)
  setSessionUserId(user.id)

  if (role === ROLES.CLIENT) {
    migrateLegacyFinanceDataToUser(user.id)
  }

  return user
}

export function loginUser({ email, password }) {
  const user = getUserByEmail(email)
  if (!user || !verifyPassword(password, user.passwordHash)) {
    throw new Error('Correo o contraseña incorrectos.')
  }
  setSessionUserId(user.id)
  if (user.role === ROLES.CLIENT) {
    migrateLegacyFinanceDataToUser(user.id)
  }
  return user
}

export function logoutUser() {
  setSessionUserId(null)
}

export function refreshUser(userId) {
  return getUserById(userId)
}

export function linkClientToAdvisor(clientId, { advisorKey, advisorEmail }) {
  const users = readUsers()
  const clientIndex = users.findIndex((u) => u.id === clientId && u.role === ROLES.CLIENT)
  if (clientIndex === -1) throw new Error('Cliente no encontrado.')

  let advisor = null
  const key = String(advisorKey ?? '').trim()
  const mail = normalizeEmail(advisorEmail)

  if (key) {
    advisor = users.find(
      (u) => u.role === ROLES.ADVISOR && String(u.advisorKey).toUpperCase() === key.toUpperCase(),
    )
  } else if (mail) {
    advisor = users.find((u) => u.role === ROLES.ADVISOR && normalizeEmail(u.email) === mail)
  }

  if (!advisor) throw new Error('No se encontró un asesor con ese código o correo.')

  if (clientId === advisor.id) {
    throw new Error('No puedes vincularte a ti mismo.')
  }

  const activeIds = (advisor.clientIds ?? []).filter((id) => {
    const c = users.find((u) => u.id === id)
    return c?.advisorId === advisor.id
  })

  const alreadyLinked = activeIds.includes(clientId)
  if (!alreadyLinked && activeIds.length >= MAX_ADVISOR_CLIENTS) {
    throw new Error(`El asesor ya tiene el máximo de ${MAX_ADVISOR_CLIENTS} clientes activos.`)
  }

  if (users[clientIndex].advisorId && users[clientIndex].advisorId !== advisor.id) {
    unlinkClientFromAdvisor(clientId, { users, skipWrite: true })
  }

  users[clientIndex] = { ...users[clientIndex], advisorId: advisor.id }

  const advisorIndex = users.findIndex((u) => u.id === advisor.id)
  const clientIds = new Set(users[advisorIndex].clientIds ?? [])
  clientIds.add(clientId)
  users[advisorIndex] = {
    ...users[advisorIndex],
    clientIds: [...clientIds].slice(0, MAX_ADVISOR_CLIENTS + 2),
  }

  writeUsers(users)
  return { client: users[clientIndex], advisor: users[advisorIndex] }
}

export function unlinkClientFromAdvisor(clientId, options = {}) {
  let users = options.users ?? readUsers()
  const clientIndex = users.findIndex((u) => u.id === clientId)
  if (clientIndex === -1) return null

  const previousAdvisorId = users[clientIndex].advisorId
  if (!previousAdvisorId) return users[clientIndex]

  users[clientIndex] = { ...users[clientIndex], advisorId: null }

  const advisorIndex = users.findIndex((u) => u.id === previousAdvisorId)
  if (advisorIndex !== -1) {
    users[advisorIndex] = {
      ...users[advisorIndex],
      clientIds: (users[advisorIndex].clientIds ?? []).filter((id) => id !== clientId),
    }
  }

  if (!options.skipWrite) writeUsers(users)
  return users[clientIndex]
}

export function getAdvisorClients(advisorId) {
  const users = readUsers()
  const advisor = users.find((u) => u.id === advisorId && u.role === ROLES.ADVISOR)
  if (!advisor) return []

  const ids = advisor.clientIds ?? []
  return ids
    .map((id) => users.find((u) => u.id === id && u.role === ROLES.CLIENT))
    .filter(Boolean)
    .filter((c) => c.advisorId === advisorId)
}

export function getClientAdvisor(clientId) {
  const client = getUserById(clientId)
  if (!client?.advisorId) return null
  return getUserById(client.advisorId)
}
