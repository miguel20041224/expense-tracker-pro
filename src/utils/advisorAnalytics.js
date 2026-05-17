import { computeSummary, computeCategories, filterCurrentMonth } from './finance'
import { computeCreditCardStats } from './creditCards'
import { buildSnowballRecommendation } from './debts'

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

export function computeAdvisorMetrics({ transactions, creditCards, goals, debts, income = null }) {
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

export function generateFinancialInsights(metrics, { creditCards }) {
  const insights = []
  const { summary, categories, leisurePercent, debtToIncome, creditUsagePercent, snowball, cardStats } =
    metrics

  if (leisurePercent >= 70 && summary.expenses > 0) {
    insights.push({
      type: 'warning',
      text: `El cliente está gastando más del ${Math.round(leisurePercent)}% en ocio y entretenimiento.`,
    })
  } else if (leisurePercent >= 50 && summary.expenses > 0) {
    insights.push({
      type: 'info',
      text: `El ${Math.round(leisurePercent)}% de los gastos del mes corresponde a categorías de ocio.`,
    })
  }

  if (metrics.riskLevel === 'alto') {
    insights.push({
      type: 'danger',
      text: 'Alto riesgo de sobreendeudamiento. Revisar gastos, crédito y deudas con prioridad.',
    })
  } else if (metrics.riskLevel === 'medio') {
    insights.push({
      type: 'warning',
      text: 'Riesgo financiero moderado: conviene reforzar ahorro y control de deuda.',
    })
  }

  if (summary.isOverBudget) {
    insights.push({
      type: 'danger',
      text: 'El cliente superó su presupuesto mensual. Los gastos superan ingresos asignados.',
    })
  }

  if (debtToIncome > 50 && metrics.totalDebt > 0) {
    insights.push({
      type: 'warning',
      text: `La deuda total representa el ${Math.round(debtToIncome)}% de los ingresos mensuales.`,
    })
  }

  if (creditUsagePercent > 80) {
    insights.push({
      type: 'danger',
      text: `Uso de crédito muy alto (${Math.round(creditUsagePercent)}%). Riesgo de impago en tarjetas.`,
    })
  }

  const topCategory = categories[0]
  if (topCategory && topCategory.percent >= 45) {
    insights.push({
      type: 'info',
      text: `Concentración en "${topCategory.name}": ${topCategory.percent}% del gasto mensual.`,
    })
  }

  const priorityCard = cardStats.find((c) => c.stats.usagePercent >= 75)
  if (priorityCard) {
    insights.push({
      type: 'warning',
      text: `Recomendación: priorizar pago de tarjeta ${priorityCard.card.name} (${Math.round(priorityCard.stats.usagePercent)}% de uso).`,
    })
  } else if (snowball.priority) {
    insights.push({
      type: 'info',
      text: `Recomendación: priorizar pago de deuda "${snowball.priority.name}" (método bola de nieve).`,
    })
  }

  if (summary.income > 0 && summary.savings > 0) {
    const rate = Math.round((summary.savings / summary.income) * 100)
    insights.push({
      type: 'success',
      text: `Ahorro mensual estimado: ${rate}% de los ingresos (${summary.savings >= 0 ? 'positivo' : 'negativo'}).`,
    })
  }

  if (insights.length === 0) {
    insights.push({
      type: 'info',
      text: 'Sin alertas críticas este mes. Mantener seguimiento de gastos y metas.',
    })
  }

  return insights
}

/** Serie de gastos por mes (últimos 6 meses) para gráfico de líneas. */
export function buildMonthlyExpenseTrend(transactions, months = 6) {
  const now = new Date()
  const points = []

  for (let i = months - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const prefix = d.toISOString().slice(0, 7)
    const label = d.toLocaleDateString('es', { month: 'short', year: '2-digit' })
    const monthTx = transactions.filter((t) => t.date?.startsWith(prefix))
    const income =
      monthTx.filter((t) => t.type === 'budget' || t.type === 'income').reduce(
        (s, t) => s + Math.abs(t.amount),
        0,
      )
    const expenses = monthTx
      .filter((t) => t.type === 'expense')
      .reduce((s, t) => s + Math.abs(t.amount), 0)

    points.push({ month: label, income, expenses, savings: income - expenses })
  }

  return points
}
