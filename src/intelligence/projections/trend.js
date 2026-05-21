import { buildMonthlyExpenseTrend } from '../trends'
import { deriveMonthlySavingsFromTrend } from './cashFlow'
import { futureMonthLabel } from './helpers'

/**
 * Serie histórica + proyección futura para gráficos (6 pasado + N futuro).
 */
export function buildHistoricalAndForecastTrend(
  transactions,
  historicalMonths = 6,
  forecastMonths = 6,
) {
  const historical = buildMonthlyExpenseTrend(transactions, historicalMonths).map((p) => ({
    ...p,
    period: 'history',
    isForecast: false,
  }))

  const avgIncome = averageField(historical, 'income') || historical.at(-1)?.income || 0
  const avgExpenses = averageField(historical, 'expenses') || historical.at(-1)?.expenses || 0
  const avgSavings =
    deriveMonthlySavingsFromTrend(historical, (historical.at(-1)?.savings ?? 0))

  const forecast = []
  for (let i = 1; i <= forecastMonths; i += 1) {
    forecast.push({
      month: futureMonthLabel(i),
      income: Math.max(0, avgIncome),
      expenses: Math.max(0, avgExpenses),
      savings: avgSavings,
      period: 'forecast',
      isForecast: true,
    })
  }

  return [...historical, ...forecast]
}

function averageField(points, field) {
  const values = points.map((p) => p[field] ?? 0).filter((v) => v > 0)
  if (values.length === 0) return 0
  return values.reduce((a, b) => a + b, 0) / values.length
}
