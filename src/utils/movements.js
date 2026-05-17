export function createTransactionId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function formatMovementDateTime(isoString, locale = 'es-ES') {
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return '—'

  const datePart = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)

  const timePart = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date)

  return `${datePart} - ${timePart}`
}

export function getMovementTimestamp(transaction) {
  if (transaction.createdAt) {
    const ts = new Date(transaction.createdAt).getTime()
    if (!Number.isNaN(ts)) return ts
  }
  if (transaction.date) {
    return new Date(`${transaction.date}T12:00:00`).getTime()
  }
  return 0
}

import { normalizeAuditMetadata } from './transactionAudit'
import { normalizeFavoriteMetadata } from './movementFlags'

/** Asegura createdAt en movimientos guardados antes de esta versión. */
export function normalizeTransaction(transaction) {
  if (!transaction || typeof transaction !== 'object') return transaction

  let normalized = transaction

  if (!transaction.createdAt && transaction.date) {
    normalized = {
      ...transaction,
      createdAt: new Date(`${transaction.date}T12:00:00`).toISOString(),
    }
  }

  return normalizeFavoriteMetadata(normalizeAuditMetadata(normalized))
}

export function dedupeTransactionsById(transactions) {
  const seen = new Set()

  return transactions.filter((transaction) => {
    const id = transaction?.id
    if (!id) return true
    if (seen.has(id)) return false
    seen.add(id)
    return true
  })
}

export function normalizeStoredTransactions(transactions) {
  if (!Array.isArray(transactions)) return []

  return dedupeTransactionsById(transactions.map(normalizeTransaction))
}

export function sortTransactionsByDate(transactions) {
  return [...transactions].sort(
    (a, b) => getMovementTimestamp(b) - getMovementTimestamp(a),
  )
}
