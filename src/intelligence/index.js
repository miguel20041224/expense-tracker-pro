import { computeFinancialMetrics } from './metrics'
import { generateFinancialInsights } from './insights'
import { computeFinancialHealthScore } from './healthScore'

export { computeFinancialMetrics, generateFinancialInsights, computeFinancialHealthScore }
export { buildMonthlyExpenseTrend } from './trends'

/** Análisis completo para el dashboard del copiloto financiero. */
export function runFinancialAnalysis(financialData) {
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

  const insights = generateFinancialInsights(metrics)
  const health = computeFinancialHealthScore(metrics)

  return { metrics, insights, health }
}
