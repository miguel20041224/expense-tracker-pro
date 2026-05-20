export class PermissionError extends Error {
  constructor(message) {
    super(message)
    this.name = 'PermissionError'
  }
}

function actorUid(actor) {
  return actor?.uid ?? actor?.id
}

export function canWriteFinancialData(actor, userId) {
  if (!actor || !userId) return false
  return actorUid(actor) === userId
}

export function canReadFinancialData(actor, userId) {
  if (!actor || !userId) return false
  return actorUid(actor) === userId
}

export function assertCanWrite(actor, userId) {
  if (!canWriteFinancialData(actor, userId)) {
    throw new PermissionError('No tienes permiso para modificar estos datos financieros.')
  }
}

export function assertCanRead(actor, userId) {
  if (!canReadFinancialData(actor, userId)) {
    throw new PermissionError('No tienes permiso para ver estos datos financieros.')
  }
}
