import { isBudgetTransaction } from './budget'

export function getTransactionTimestamp(transaction) {
  if (isBudgetTransaction(transaction) && transaction.createdAt) {
    return new Date(transaction.createdAt).getTime()
  }
  if (transaction.date) {
    return new Date(`${transaction.date}T12:00:00`).getTime()
  }
  return 0
}

export function sortTransactionsByDate(transactions) {
  return [...transactions].sort(
    (a, b) => getTransactionTimestamp(b) - getTransactionTimestamp(a),
  )
}
