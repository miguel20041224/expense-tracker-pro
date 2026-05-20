import { computeSummary, computeCategories, filterCurrentMonth } from '../utils/finance'
import { computeCreditCardStats } from '../utils/creditCards'
import { buildSnowballRecommendation } from '../utils/debts'

const LEISURE_CATEGORIES = [
  'ocio',
  'entretenimiento',
  'restaurantes',
  'viajes',
  'hobbies',
  'streaming',
]

function matchesLeisure(category) {
  const name = String(category ?? '').toLowerCase()
  return LEISURE_CATEGORIES.some((k) => name.includes(k))
}

/** Métricas agregadas para reglas, score y reportes. */
export function computeFinancialMetrics({
  transactions,
  creditCards,
  goals,
  debts,
  income = null,
}) {
  const summary = computeSummary(transactions, income)
  const categories = computeCategories(transactions)
  const monthTx = filterCurrentMonth(transactions)
  const expenseCount = monthTx.filter((t) => t.type === 'expense').length
  const avgExpense = expenseCount > 0 ? summary.expenses / expenseCount : 0

  const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0)
  const debtToIncome =
    summary.income > 0 ? (totalDebt / summary.income) * 100 : totalDebt > 0 ? 100 : 0

  const cardStats = creditCards.map((card) => ({
    card,
    stats: computeCreditCardStats(card, transactions),
  }))
  const maxCardUsage = cardStats.reduce((max, c) => Math.max(max, c.stats.usagePercent), 0)
  const totalCreditLimit = creditCards.reduce((sum, c) => sum + c.limit, 0)
  const totalCreditUsed = cardStats.reduce((sum, c) => sum + c.stats.usedBalance, 0)
  const creditUsagePercent =
    totalCreditLimit > 0 ? Math.min((totalCreditUsed / totalCreditLimit) * 100, 100) : 0

  const goalsProgress = goals.map((g) => ({
    id: g.id,
    name: g.name,
    percent: g.targetAmount > 0 ? Math.min((g.currentAmount / g.targetAmount) * 100, 100) : 0,
    currentAmount: g.currentAmount,
    targetAmount: g.targetAmount,
  }))

  const leisureSpend = categories
    .filter((c) => matchesLeisure(c.name))
    .reduce((sum, c) => sum + c.amount, 0)
  const leisurePercent =
    summary.expenses > 0 ? (leisureSpend / summary.expenses) * 100 : 0

  let riskLevel = 'bajo'
  let riskScore = 0
  if (summary.isOverBudget) riskScore += 30
  if (debtToIncome > 50) riskScore += 25
  if (creditUsagePercent > 70) riskScore += 25
  if (leisurePercent > 40) riskScore += 10
  if (summary.income > 0 && summary.expenses / summary.income > 0.9) riskScore += 15

  if (riskScore >= 55) riskLevel = 'alto'
  else if (riskScore >= 30) riskLevel = 'medio'

  const snowball = buildSnowballRecommendation(debts, 0)

  return {
    summary,
    categories,
    monthTx,
    avgExpense,
    monthlySavings: summary.savings,
    totalDebt,
    debtToIncome,
    cardStats,
    maxCardUsage,
    creditUsagePercent,
    totalCreditLimit,
    totalCreditUsed,
    goalsProgress,
    leisurePercent,
    riskLevel,
    riskScore,
    snowball,
    expenseCount,
  }
}
