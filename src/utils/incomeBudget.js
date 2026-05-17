import { filterCurrentMonth } from './finance'

function sumMonthExpenses(transactions) {
  return filterCurrentMonth(transactions)
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
}

const DAYS_PER_MONTH = 30
const WEEKS_PER_MONTH = 52 / 12

export const EMPTY_INCOME = { type: 'monthly', amount: 0 }
export const EMPTY_BUDGET = { limit: 0, remaining: 0 }

export function normalizeIncomeConfig(income) {
  if (!income || typeof income !== 'object') return { ...EMPTY_INCOME }
  const type = ['daily', 'weekly', 'biweekly', 'monthly'].includes(income.type)
    ? income.type
    : 'monthly'
  const amount = Math.max(0, Number(income.amount) || 0)
  return { type, amount }
}

export function periodToMonthlyAmount(type, amount) {
  const value = Math.max(0, Number(amount) || 0)
  switch (type) {
    case 'daily':
      return value * DAYS_PER_MONTH
    case 'weekly':
      return value * WEEKS_PER_MONTH
    case 'biweekly':
      return value * 2
    case 'monthly':
    default:
      return value
  }
}

/** Presupuesto mensual equivalente según ingreso configurado. */
export function computeIncomeLimit(income) {
  const normalized = normalizeIncomeConfig(income)
  return periodToMonthlyAmount(normalized.type, normalized.amount)
}

/**
 * Resumen de presupuesto del mes (ingreso configurado + gastos del mes).
 * Compatible con presupuestos legacy en transacciones type=budget.
 */
export function computeBudgetOverview(transactions, incomeConfig, legacyBudgetTotal = 0) {
  const income = normalizeIncomeConfig(incomeConfig)
  const configuredLimit = computeIncomeLimit(income)
  const limit = configuredLimit > 0 ? configuredLimit : legacyBudgetTotal

  const spent = sumMonthExpenses(transactions)
  const remaining = limit - spent
  const usagePercent = limit > 0 ? Math.min((spent / limit) * 100, 999) : 0

  return {
    income,
    limit,
    spent,
    remaining,
    usagePercent,
    isOverBudget: remaining < 0,
    hasConfiguredIncome: configuredLimit > 0,
    hasLimit: limit > 0,
  }
}

export function buildBudgetSnapshot(transactions, incomeConfig) {
  const overview = computeBudgetOverview(transactions, incomeConfig)
  return {
    limit: overview.limit,
    remaining: overview.remaining,
  }
}
