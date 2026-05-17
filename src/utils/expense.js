import { createTransactionId } from './movements'
import { createCreationAuditMetadata } from './transactionAudit'

export function isExpenseTransaction(transaction) {
  return transaction?.type === 'expense'
}

export function createExpenseTransaction({ name, category, amount, date }) {
  const now = new Date()
  const calendarDate = date || now.toISOString().slice(0, 10)

  return {
    id: createTransactionId(),
    type: 'expense',
    label: name.trim(),
    category,
    amount: -Math.abs(amount),
    date: calendarDate,
    ...createCreationAuditMetadata(now.toISOString()),
  }
}
