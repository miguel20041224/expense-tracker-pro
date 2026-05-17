import { isBudgetTransaction } from './budget'
import { isExpenseTransaction } from './expense'

export function formatAmountForInput(amount, locale) {
  const abs = Math.abs(Number(amount))
  if (!Number.isFinite(abs)) return ''

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(abs)
}

export function getExpenseEditFormValues(transaction, locale) {
  return {
    name: transaction.label ?? '',
    amount: formatAmountForInput(transaction.amount, locale),
    category: transaction.category ?? '',
    description: transaction.description ?? '',
  }
}

export function getBudgetEditFormValues(transaction, locale) {
  return {
    amount: formatAmountForInput(transaction.amount, locale),
    budgetType: transaction.budgetType ?? '',
    description: transaction.description ?? '',
  }
}

export function getEditFormValues(transaction, locale) {
  if (isExpenseTransaction(transaction)) {
    return { type: 'expense', values: getExpenseEditFormValues(transaction, locale) }
  }
  if (isBudgetTransaction(transaction)) {
    return { type: 'budget', values: getBudgetEditFormValues(transaction, locale) }
  }
  return null
}
