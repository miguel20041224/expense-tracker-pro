import { getBudgetTypeLabel } from '../data/budgetTypes'

function createId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return String(Date.now())
}

export function getBudgetMovementLabel(budgetTypeId) {
  const typeLabel = getBudgetTypeLabel(budgetTypeId)
  return `Presupuesto ${typeLabel} agregado`
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

export function createBudgetTransaction({ amount, budgetType, description }) {
  const now = new Date()

  return {
    id: createId(),
    type: 'budget',
    budgetType,
    label: getBudgetMovementLabel(budgetType),
    description: description?.trim() || undefined,
    amount: Math.abs(amount),
    date: now.toISOString().slice(0, 10),
    createdAt: now.toISOString(),
  }
}

export function isBudgetTransaction(transaction) {
  return transaction?.type === 'budget'
}
