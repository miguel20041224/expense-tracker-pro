import { buildFinancialContext } from '../contextBuilder'
import { runInsightRules } from '../engine/runRulePipeline'
import { computeFinancialHealthScore } from '../healthScore'
import { buildMonthlyExpenseTrend } from '../trends'
import { generateAlerts } from '../alerts'
import { buildDailyReport } from './dailyReport'
import { buildWeeklyReport } from './weeklyReport'
import { buildMonthlyReport } from './monthlyReport'

export { buildDailyReport, buildWeeklyReport, buildMonthlyReport }

/** Genera los tres reportes a partir de datos financieros. */
export function buildAllReports(financialData, options = {}) {
  const context = buildFinancialContext(financialData)
  const insights = runInsightRules(context)
  const health = computeFinancialHealthScore(context.metrics)
  const trend = buildMonthlyExpenseTrend(context.transactions, 6)
  const alerts = generateAlerts(context, insights)

  const analysis = {
    context,
    metrics: context.metrics,
    insights,
    health,
    trend,
    alerts,
  }

  return {
    daily: buildDailyReport(context, analysis, options),
    weekly: buildWeeklyReport(context, analysis, options),
    monthly: buildMonthlyReport(context, analysis, options),
    analysis,
  }
}

export function buildReport(financialData, type, options = {}) {
  const all = buildAllReports(financialData, options)
  return all[type] ?? all.monthly
}
