import { formatMovementDateTime } from './movements'

/** Campos de trazabilidad en cada movimiento (extensible para auditLog). */
export const TRANSACTION_AUDIT_FIELDS = Object.freeze(['createdAt', 'updatedAt'])

/** Metadatos de creación para movimientos nuevos (sin updatedAt). */
export function createCreationAuditMetadata(createdAt = new Date().toISOString()) {
  return { createdAt }
}

const EXPENSE_CONTENT_KEYS = ['label', 'category', 'amount', 'description']
const BUDGET_CONTENT_KEYS = ['budgetType', 'amount', 'description', 'label']

function normalizeAuditValue(value) {
  if (value === undefined || value === null || value === '') return undefined
  if (typeof value === 'number') return value
  if (typeof value === 'string') return value.trim()
  return value
}

export function isValidAuditTimestamp(value) {
  if (!value || typeof value !== 'string') return false
  return !Number.isNaN(new Date(value).getTime())
}

export function wasTransactionEdited(transaction) {
  const { updatedAt, createdAt } = transaction ?? {}
  if (!isValidAuditTimestamp(updatedAt)) return false
  if (!isValidAuditTimestamp(createdAt)) return true
  return new Date(updatedAt).getTime() > new Date(createdAt).getTime()
}

export function formatEditedLabel(updatedAt, locale = 'es-ES') {
  if (!isValidAuditTimestamp(updatedAt)) return null
  return `Editado el ${formatMovementDateTime(updatedAt, locale)}`
}

/**
 * Normaliza metadatos de auditoría al cargar desde localStorage.
 * Elimina updatedAt inválido o que no representa una edición posterior a la creación.
 */
export function normalizeAuditMetadata(transaction) {
  if (!transaction || typeof transaction !== 'object') return transaction

  const { updatedAt, ...rest } = transaction

  if (!updatedAt) return transaction

  if (!isValidAuditTimestamp(updatedAt)) {
    const { updatedAt: _removed, ...withoutUpdated } = transaction
    return withoutUpdated
  }

  const createdAt = transaction.createdAt
  if (isValidAuditTimestamp(createdAt)) {
    if (new Date(updatedAt).getTime() <= new Date(createdAt).getTime()) {
      const { updatedAt: _removed, ...withoutUpdated } = transaction
      return withoutUpdated
    }
  }

  return transaction
}

export function pickContentSnapshot(transaction, keys) {
  return keys.reduce((acc, key) => {
    acc[key] = normalizeAuditValue(transaction[key])
    return acc
  }, {})
}

export function hasContentChanged(before, after, keys) {
  const snapshotBefore = pickContentSnapshot(before, keys)
  const snapshotAfter = pickContentSnapshot(after, keys)
  return keys.some((key) => snapshotBefore[key] !== snapshotAfter[key])
}

export function hasExpenseContentChanged(before, after) {
  return hasContentChanged(before, after, EXPENSE_CONTENT_KEYS)
}

export function hasBudgetContentChanged(before, after) {
  return hasContentChanged(before, after, BUDGET_CONTENT_KEYS)
}

/**
 * Aplica sello de edición preservando fecha de creación y calendario originales.
 * Punto único para futuras entradas en auditLog.
 */
export function applyEditStamp(next, existing, editedAt = new Date().toISOString()) {
  return {
    ...next,
    createdAt: existing.createdAt,
    date: existing.date,
    updatedAt: editedAt,
  }
}

/**
 * Resuelve resultado de edición: sin cambios → transacción intacta; con cambios → sello.
 */
export function finalizeEditedTransaction(existing, next, hasChanged) {
  if (!hasChanged) return existing
  return applyEditStamp(next, existing)
}

/** Preparado para historial detallado (auditLog) en iteraciones futuras. */
export function createEditAuditEntry(existing, next, contentKeys, editedAt = new Date().toISOString()) {
  const changedFields = contentKeys.filter((key) => {
    return normalizeAuditValue(existing[key]) !== normalizeAuditValue(next[key])
  })

  return {
    at: editedAt,
    fields: changedFields,
  }
}
