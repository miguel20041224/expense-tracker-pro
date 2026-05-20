import { buildFinancialContext } from './contextBuilder'
import { runInsightRules } from './engine/runRulePipeline'
import { computeFinancialMetrics } from './metrics'
import { computeFinancialHealthScore } from './healthScore'
import { buildMonthlyExpenseTrend } from './trends'

export { buildFinancialContext, runInsightRules }
export { computeFinancialMetrics } from './metrics'
export { computeFinancialHealthScore } from './healthScore'
export { generateFinancialInsights } from './insights'
export { buildMonthlyExpenseTrend } from './trends'
export { INSIGHT_RULES } from './rules'

/** Análisis completo para el dashboard del copiloto financiero. */
export function runFinancialAnalysis(financialData) {
  const context = buildFinancialContext(financialData)
  const insights = runInsightRules(context)
  const health = computeFinancialHealthScore(context.metrics)
  const trend = buildMonthlyExpenseTrend(context.transactions, 6)

  return {
    context,
    metrics: context.metrics,
    insights,
    health,
    trend,
  }
}
