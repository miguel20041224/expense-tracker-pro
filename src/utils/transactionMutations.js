import { getBudgetMovementLabel, isBudgetTransaction } from './budget'
import { isExpenseTransaction } from './expense'

export function canMutateTransaction(transaction) {
  return isExpenseTransaction(transaction) || isBudgetTransaction(transaction)
}

export function updateExpenseTransaction(existing, { name, category, amount, description }) {
  return {
    ...existing,
    label: name.trim(),
    category,
    amount: -Math.abs(amount),
    description: description?.trim() || undefined,
  }
}

export function updateBudgetTransaction(existing, { amount, budgetType, description }) {
  return {
    ...existing,
    budgetType,
    label: getBudgetMovementLabel(budgetType),
    amount: Math.abs(amount),
    description: description?.trim() || undefined,
  }
}

export function applyTransactionUpdate(transactions, id, updater) {
  const index = transactions.findIndex((t) => t.id === id)
  if (index === -1) return transactions

  const current = transactions[index]
  const updated = updater(current)
  if (!updated) return transactions

  const next = [...transactions]
  next[index] = updated
  return next
}
