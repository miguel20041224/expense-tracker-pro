import { isExpenseTransaction } from './expense'
import { mapCategoryToExpenseType, resolvePaymentMethod } from '../data/expenseTaxonomy'

export const EMPTY_TRANSACTION_FILTERS = {
  expenseType: '',
  category: '',
  paymentMethod: '',
  dateFrom: '',
  dateTo: '',
}

export function filterExpenseTransactions(transactions, filters = EMPTY_TRANSACTION_FILTERS) {
  const expenses = transactions.filter(isExpenseTransaction)

  return expenses.filter((tx) => {
    if (filters.expenseType) {
      const type = mapCategoryToExpenseType(tx.category)
      if (type !== filters.expenseType) return false
    }

    if (filters.category) {
      const cat = (tx.category ?? '').trim()
      if (cat !== filters.category) return false
    }

    if (filters.paymentMethod) {
      if (resolvePaymentMethod(tx) !== filters.paymentMethod) return false
    }

    if (filters.dateFrom && tx.date < filters.dateFrom) return false
    if (filters.dateTo && tx.date > filters.dateTo) return false

    return true
  })
}

export function hasActiveTransactionFilters(filters) {
  return Boolean(
    filters.expenseType ||
      filters.category ||
      filters.paymentMethod ||
      filters.dateFrom ||
      filters.dateTo,
  )
}

export function countActiveTransactionFilters(filters) {
  return [
    filters.expenseType,
    filters.category,
    filters.paymentMethod,
    filters.dateFrom,
    filters.dateTo,
  ].filter(Boolean).length
}
