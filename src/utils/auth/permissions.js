import { ROLES } from './constants'

export class PermissionError extends Error {
  constructor(message) {
    super(message)
    this.name = 'PermissionError'
  }
}

export function isClient(user) {
  return user?.role === ROLES.CLIENT
}

export function isAdvisor(user) {
  return user?.role === ROLES.ADVISOR
}

/** Solo el cliente puede modificar sus propios datos financieros. */
function actorUid(actor) {
  return actor?.uid ?? actor?.id
}

export function canWriteFinancialData(actor, clientId) {
  if (!actor || !clientId) return false
  return isClient(actor) && actorUid(actor) === clientId
}

/** Cliente: solo los suyos. Asesor: clientes vinculados. */
export function canReadFinancialData(actor, clientId, advisorClientIds = []) {
  if (!actor || !clientId) return false
  if (isClient(actor) && actorUid(actor) === clientId) return true
  if (isAdvisor(actor) && Array.isArray(advisorClientIds)) {
    return advisorClientIds.includes(clientId)
  }
  return false
}

export function assertCanWrite(actor, clientId) {
  if (!canWriteFinancialData(actor, clientId)) {
    throw new PermissionError('No tienes permiso para modificar estos datos financieros.')
  }
}

export function assertCanRead(actor, clientId, advisorClientIds = []) {
  if (!canReadFinancialData(actor, clientId, advisorClientIds)) {
    throw new PermissionError('No tienes permiso para ver estos datos financieros.')
  }
}
