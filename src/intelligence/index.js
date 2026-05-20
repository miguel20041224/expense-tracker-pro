import { buildFinancialContext } from './contextBuilder'
import { runInsightRules } from './engine/runRulePipeline'
import { computeFinancialMetrics } from './metrics'
import { computeFinancialHealthScore } from './healthScore'
import { buildMonthlyExpenseTrend } from './trends'
import { generateAlerts, filterActiveAlerts } from './alerts'

export { buildFinancialContext, runInsightRules }
export { computeFinancialMetrics } from './metrics'
export { computeFinancialHealthScore } from './healthScore'
export { generateFinancialInsights } from './insights'
export { buildMonthlyExpenseTrend } from './trends'
export { INSIGHT_RULES } from './rules'
export { buildAllReports, buildReport } from './reports'
export { generateAlerts, filterActiveAlerts, buildAlertKey, getDismissedHistory } from './alerts'

/** Análisis completo para el dashboard del copiloto financiero. */
export function runFinancialAnalysis(financialData) {
  const context = buildFinancialContext(financialData)
  const insights = runInsightRules(context)
  const health = computeFinancialHealthScore(context.metrics)
  const trend = buildMonthlyExpenseTrend(context.transactions, 6)
  const alerts = generateAlerts(context, insights)

  return {
    context,
    metrics: context.metrics,
    insights,
    health,
    trend,
    alerts,
  }
}
