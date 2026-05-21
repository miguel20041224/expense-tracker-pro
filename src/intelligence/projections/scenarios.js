import { applyCashFlowScenario, projectCumulativeSavings } from './cashFlow'
import { projectDebtOutlook } from './debt'

/**
 * Comparación de escenarios: actual vs ajustes de gasto/ahorro/deuda.
 */
export function buildScenarioComparison(context, options = {}) {
  const { metrics, debts } = context
  const summary = metrics.summary
  const {
    expenseReductionPercent = 0,
    savingsBoostPercent = 0,
    extraDebtPayment = 0,
  } = options

  const current = {
    id: 'current',
    label: 'Ritmo actual',
    savings: summary.savings,
    monthlySavings: metrics.monthlySavings,
    sixMonthTotal: projectCumulativeSavings(metrics.monthlySavings, 6).total,
    debtMonths: projectDebtOutlook(debts, 0).monthsToFree,
  }

  const adjustedSummary = applyCashFlowScenario(summary, {
    expenseReductionPercent,
    savingsBoostPercent,
  })

  const scenario = {
    id: 'scenario',
    label: 'Con simulación',
    savings: adjustedSummary.savings,
    monthlySavings: adjustedSummary.monthlySavings,
    sixMonthTotal: projectCumulativeSavings(adjustedSummary.monthlySavings, 6).total,
    debtMonths: projectDebtOutlook(debts, extraDebtPayment).monthsToFree,
  }

  return {
    current,
    scenario,
    delta: {
      monthlySavings: scenario.monthlySavings - current.monthlySavings,
      sixMonthTotal: scenario.sixMonthTotal - current.sixMonthTotal,
      debtMonths: current.debtMonths - scenario.debtMonths,
    },
  }
}
