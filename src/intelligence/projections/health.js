import { averageRecent, clamp } from './helpers'

const LEVELS = [
  { min: 80, id: 'saludable', label: 'Saludable' },
  { min: 60, id: 'estable', label: 'Estable' },
  { min: 40, id: 'en-riesgo', label: 'En riesgo' },
  { min: 0, id: 'critico', label: 'Crítico' },
]

/**
 * Proyecta evolución del score de salud según tendencia de ahorro y deuda.
 */
export function projectHealthOutlook(metrics, trend, horizonMonths = 6) {
  const currentScore = Math.round(100 - clamp(metrics.riskScore ?? 0, 0, 100))
  const savingsSeries = (trend ?? []).map((p) => p.savings ?? 0)
  const recentAvg = averageRecent(savingsSeries, 3)
  const currentSavings = metrics.monthlySavings ?? metrics.summary?.savings ?? 0

  const savingsDelta = recentAvg - currentSavings
  const monthlyScoreShift = estimateScoreShift(savingsDelta, metrics)

  const projections = []
  let projectedScore = currentScore

  for (let m = 1; m <= horizonMonths; m += 1) {
    projectedScore = clamp(
      Math.round(projectedScore + monthlyScoreShift * 0.35),
      0,
      100,
    )
    const level = LEVELS.find((l) => projectedScore >= l.min) ?? LEVELS[LEVELS.length - 1]
    projections.push({
      month: m,
      score: projectedScore,
      level: level.id,
      levelLabel: level.label,
    })
  }

  const end = projections[projections.length - 1]
  const direction =
    end.score > currentScore + 2
      ? 'improving'
      : end.score < currentScore - 2
        ? 'declining'
        : 'stable'

  return {
    currentScore,
    currentLevel: LEVELS.find((l) => currentScore >= l.min)?.id ?? 'critico',
    projectedScore: end?.score ?? currentScore,
    projectedLevel: end?.level ?? 'critico',
    projectedLevelLabel: end?.levelLabel ?? 'Crítico',
    direction,
    points: projections,
    monthlyScoreShift,
  }
}

function estimateScoreShift(savingsDelta, metrics) {
  let shift = 0
  if (savingsDelta > 50) shift += 2
  else if (savingsDelta > 0) shift += 1
  else if (savingsDelta < -50) shift -= 3
  else if (savingsDelta < 0) shift -= 1

  if (metrics.summary?.isOverBudget) shift -= 2
  if (metrics.debtToIncome > 40) shift -= 1
  if (metrics.totalDebt <= 0 && metrics.summary?.savings > 0) shift += 1

  return shift
}
