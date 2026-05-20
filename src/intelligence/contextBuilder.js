import { computeFinancialMetrics } from './metrics'
import {
  computeCategoriesFromTransactions,
  computeCategoryGrowth,
  sumExpensesInRange,
  sumExpensesOnDate,
  toDateKey,
} from './rules/helpers'

const MICRO_SPEND_MAX = 25
const MICRO_SPEND_MIN_COUNT = 4

/**
 * @typedef {Object} TemporalSnapshot
 * @property {string} today
 * @property {string} yesterday
 * @property {number} todayExpenses
 * @property {number} yesterdayExpenses
 * @property {number} last7DaysExpenses
 * @property {number} previous7DaysExpenses
 * @property {string} currentMonthPrefix
 * @property {string} previousMonthPrefix
 */

/**
 * @param {import('./types').FinancialContext['transactions']} transactions
 * @returns {TemporalSnapshot}
 */
function buildTemporalSnapshot(transactions) {
  const now = new Date()
  const today = toDateKey(now)
  const yesterdayDate = new Date(now)
  yesterdayDate.setDate(yesterdayDate.getDate() - 1)
  const yesterday = toDateKey(yesterdayDate)

  const last7Start = new Date(now)
  last7Start.setDate(last7Start.getDate() - 6)
  const prev7End = new Date(last7Start)
  prev7End.setDate(prev7End.getDate() - 1)
  const prev7Start = new Date(prev7End)
  prev7Start.setDate(prev7Start.getDate() - 6)

  const last7From = toDateKey(last7Start)
  const prev7From = toDateKey(prev7Start)
  const prev7To = toDateKey(prev7End)

  const currentMonthPrefix = today.slice(0, 7)
  const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const previousMonthPrefix = prevMonthDate.toISOString().slice(0, 7)

  return {
    today,
    yesterday,
    todayExpenses: sumExpensesOnDate(transactions, today),
    yesterdayExpenses: sumExpensesOnDate(transactions, yesterday),
    last7DaysExpenses: sumExpensesInRange(transactions, (d) => d >= last7From && d <= today),
    previous7DaysExpenses: sumExpensesInRange(
      transactions,
      (d) => d >= prev7From && d <= prev7To,
    ),
    currentMonthPrefix,
    previousMonthPrefix,
  }
}

function analyzeMicroSpends(transactions, monthPrefix, monthExpensesTotal) {
  const monthExpenses = transactions.filter(
    (t) => t.type === 'expense' && t.date?.startsWith(monthPrefix),
  )
  const small = monthExpenses.filter((t) => Math.abs(t.amount) <= MICRO_SPEND_MAX)
  const total = small.reduce((sum, t) => sum + Math.abs(t.amount), 0)
  const sharePercent =
    monthExpensesTotal > 0 ? (total / monthExpensesTotal) * 100 : 0

  return {
    count: small.length,
    total,
    sharePercent,
    threshold: MICRO_SPEND_MAX,
  }
}

/** Construye el contexto completo para el pipeline de reglas. */
export function buildFinancialContext(financialData) {
  const {
    transactions = [],
    creditCards = [],
    goals = [],
    debts = [],
    income = null,
  } = financialData ?? {}

  const metrics = computeFinancialMetrics({
    transactions,
    creditCards,
    goals,
    debts,
    income,
  })

  const temporal = buildTemporalSnapshot(transactions)

  const currentMonthTx = transactions.filter((t) =>
    t.date?.startsWith(temporal.currentMonthPrefix),
  )
  const previousMonthTx = transactions.filter((t) =>
    t.date?.startsWith(temporal.previousMonthPrefix),
  )

  const categoriesCurrent = computeCategoriesFromTransactions(currentMonthTx)
  const categoriesPrevious = computeCategoriesFromTransactions(previousMonthTx)
  const categoryGrowth = computeCategoryGrowth(categoriesCurrent, categoriesPrevious)
  const microSpends = analyzeMicroSpends(
    transactions,
    temporal.currentMonthPrefix,
    metrics.summary.expenses,
  )

  return {
    transactions,
    creditCards,
    goals,
    debts,
    income,
    metrics,
    temporal,
    categoriesCurrent,
    categoriesPrevious,
    categoryGrowth,
    microSpends,
  }
}
