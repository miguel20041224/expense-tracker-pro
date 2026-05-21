import { buildFinancialContext } from '../contextBuilder'
import { projectMonthEndSavings } from '../reports/shared'
import { buildMonthlyExpenseTrend } from '../trends'
import { getCalendarInfo } from './helpers'
import {
  projectExpensePace,
  projectBudgetRunway,
  projectCumulativeSavings,
  applyCashFlowScenario,
  deriveMonthlySavingsFromTrend,
} from './cashFlow'
import { projectGoalTimelines } from './goals'
import { projectDebtOutlook, buildDebtProjectionSeries } from './debt'
import { projectHealthOutlook } from './health'
import { buildHistoricalAndForecastTrend } from './trend'
import { projectCategoryGrowth } from './categories'
import { buildScenarioComparison } from './scenarios'
import { generatePredictiveInsights } from './insights'

/**
 * @typedef {Object} ProjectionOptions
 * @property {number} [horizonMonths=12]
 * @property {number} [extraDebtPayment=0]
 * @property {number} [expenseReductionPercent=0]
 * @property {number} [savingsBoostPercent=0]
 */

/**
 * Motor de proyecciones financieras (desacoplado de Firebase).
 * @param {import('../types').FinancialContext|object} contextOrData
 * @param {ProjectionOptions} [options]
 */
export function projectFinancialOutlook(contextOrData, options = {}) {
  const context = contextOrData?.metrics
    ? contextOrData
    : buildFinancialContext(contextOrData)

  const {
    horizonMonths = 12,
    extraDebtPayment = 0,
    expenseReductionPercent = 0,
    savingsBoostPercent = 0,
  } = options

  const { metrics, transactions, debts, goals } = context
  const summary = metrics.summary
  const calendar = getCalendarInfo()
  const historicalTrend = buildMonthlyExpenseTrend(transactions, 6)

  const scenarioSummary = applyCashFlowScenario(summary, {
    expenseReductionPercent,
    savingsBoostPercent,
  })

  const monthlySavings =
    scenarioSummary.monthlySavings ||
    deriveMonthlySavingsFromTrend(historicalTrend, metrics.monthlySavings)

  const monthEnd = projectMonthEndSavings(
    scenarioSummary,
    calendar.dayOfMonth,
    calendar.daysInMonth,
  )

  const outlook = {
    context,
    options,
    calendar,
    monthEnd,
    expensePace: projectExpensePace(scenarioSummary, calendar),
    budgetRunway: projectBudgetRunway(scenarioSummary, calendar),
    savings: {
      monthly: monthlySavings,
      sixMonths: projectCumulativeSavings(monthlySavings, 6),
      twelveMonths: projectCumulativeSavings(monthlySavings, 12),
    },
    debt: projectDebtOutlook(debts, extraDebtPayment),
    goals: projectGoalTimelines(goals, monthlySavings, summary.income),
    health: projectHealthOutlook(metrics, historicalTrend, Math.min(horizonMonths, 12)),
    chartTrend: buildHistoricalAndForecastTrend(transactions, 6, 6),
    categoryProjections: projectCategoryGrowth(context.categoryGrowth),
    scenarios: buildScenarioComparison(context, options),
    historicalTrend,
  }

  outlook.debtChart = buildDebtProjectionSeries(
    outlook.debt.baseline?.timeline,
    outlook.debt.withExtra?.timeline,
  )

  outlook.insights = generatePredictiveInsights(outlook)

  return outlook
}

export { generatePredictiveInsights } from './insights'
export { buildHistoricalAndForecastTrend } from './trend'
export { projectDebtOutlook, buildDebtProjectionSeries } from './debt'
export { projectGoalTimelines } from './goals'
export { projectHealthOutlook } from './health'
export { projectExpensePace, projectBudgetRunway, projectCumulativeSavings } from './cashFlow'
export { buildScenarioComparison } from './scenarios'
export { projectCategoryGrowth } from './categories'
