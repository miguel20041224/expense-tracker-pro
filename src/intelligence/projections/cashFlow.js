import { linearMonthProjection, averageRecent, getCalendarInfo } from './helpers'

/**
 * Ritmo de gastos al cierre del mes (extrapolación lineal).
 */
export function projectExpensePace(summary, calendar = getCalendarInfo()) {
  if (summary.expenses <= 0) return null
  const pace = linearMonthProjection(
    summary.expenses,
    calendar.dayOfMonth,
    calendar.daysInMonth,
  )
  if (!pace) return null

  const overIncome =
    summary.income > 0 ? pace.projected > summary.income : pace.projected > 0

  return {
    ...pace,
    currentExpenses: summary.expenses,
    overIncome,
    projectedVsIncome:
      summary.income > 0 ? (pace.projected / summary.income) * 100 : null,
  }
}

/**
 * Días estimados hasta agotar el margen del mes al ritmo actual.
 */
export function projectBudgetRunway(summary, calendar = getCalendarInfo()) {
  if (summary.savings <= 0 || summary.expenses <= 0) {
    return summary.savings <= 0 && summary.expenses > 0
      ? { daysRemaining: 0, dailyBurn: summary.expenses / Math.max(calendar.dayOfMonth, 1), exhausted: true }
      : null
  }

  const dailyBurn = summary.expenses / Math.max(calendar.dayOfMonth, 1)
  if (dailyBurn <= 0) return null

  const daysRemaining = Math.floor(summary.savings / dailyBurn)
  const exhausted = daysRemaining <= calendar.daysRemaining

  return {
    daysRemaining,
    dailyBurn,
    exhausted,
    calendarDaysLeft: calendar.daysRemaining,
  }
}

/**
 * Ahorro acumulado proyectado si se mantiene el ritmo mensual.
 */
export function projectCumulativeSavings(monthlySavings, months) {
  const monthly = Math.max(0, Number(monthlySavings) || 0)
  const total = monthly * months
  const points = []

  for (let m = 1; m <= months; m += 1) {
    points.push({
      month: m,
      label: `Mes ${m}`,
      cumulative: monthly * m,
      monthly,
    })
  }

  return { months, monthly, total, points }
}

/**
 * Ajusta ingresos/gastos según escenario de simulación.
 */
export function applyCashFlowScenario(summary, { expenseReductionPercent = 0, savingsBoostPercent = 0 } = {}) {
  const expenseFactor = 1 - clampPercent(expenseReductionPercent) / 100
  const savingsFactor = 1 + clampPercent(savingsBoostPercent) / 100

  const projectedExpenses = summary.expenses * expenseFactor
  const baseSavings = summary.income - projectedExpenses
  const adjustedSavings = baseSavings * savingsFactor

  return {
    income: summary.income,
    expenses: projectedExpenses,
    savings: adjustedSavings,
    monthlySavings: adjustedSavings,
  }
}

function clampPercent(value) {
  return Math.min(50, Math.max(0, Number(value) || 0))
}

/**
 * Promedio de ahorro mensual a partir de tendencia histórica (últimos meses).
 */
export function deriveMonthlySavingsFromTrend(trend, fallbackSavings = 0) {
  if (!trend?.length) return fallbackSavings
  const savingsSeries = trend.map((p) => p.savings ?? 0)
  const avg = averageRecent(savingsSeries, 3)
  return avg !== 0 ? avg : fallbackSavings
}
