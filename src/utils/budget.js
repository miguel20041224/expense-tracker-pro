import { getBudgetTypeLabel } from '../data/budgetTypes'
import { createTransactionId, formatMovementDateTime } from './movements'
import { createCreationAuditMetadata } from './transactionAudit'

export { formatMovementDateTime }

export function getBudgetMovementLabel(budgetTypeId) {
  const typeLabel = getBudgetTypeLabel(budgetTypeId)
  return `Presupuesto ${typeLabel} agregado`
}

export function createBudgetTransaction({ amount, budgetType, description }) {
  const now = new Date()

  return {
    id: createTransactionId(),
    type: 'budget',
    budgetType,
    label: getBudgetMovementLabel(budgetType),
    description: description?.trim() || undefined,
    amount: Math.abs(amount),
    date: now.toISOString().slice(0, 10),
    ...createCreationAuditMetadata(now.toISOString()),
  }
}

export function isBudgetTransaction(transaction) {
  return transaction?.type === 'budget'
}
