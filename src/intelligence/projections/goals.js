import { computeGoalProgress } from '../../utils/goals'
import { futureMonthLabel } from './helpers'

/**
 * ETA por meta según ahorro mensual y contribución automática.
 */
export function projectGoalTimelines(goals, monthlySavings, monthlyIncome) {
  if (!goals?.length) return []

  return goals.map((goal) => {
    const { percent, remaining, isComplete } = computeGoalProgress(goal)
    const autoMonthly =
      monthlyIncome > 0 && goal.autoContributionPercent > 0
        ? (monthlyIncome * goal.autoContributionPercent) / 100
        : 0

    const effectiveMonthly = autoMonthly > 0 ? autoMonthly : Math.max(monthlySavings, 0)
    const monthsToComplete =
      !isComplete && remaining > 0 && effectiveMonthly > 0
        ? Math.ceil(remaining / effectiveMonthly)
        : isComplete
          ? 0
          : null

    let targetDateStatus = null
    if (goal.targetDate && monthsToComplete != null) {
      const target = new Date(`${goal.targetDate}T23:59:59`)
      const eta = new Date()
      eta.setMonth(eta.getMonth() + monthsToComplete)
      if (!Number.isNaN(target.getTime())) {
        targetDateStatus = eta <= target ? 'on_track' : 'behind'
      }
    }

    const etaLabel =
      monthsToComplete != null && monthsToComplete > 0
        ? futureMonthLabel(monthsToComplete)
        : isComplete
          ? 'Completada'
          : null

    return {
      id: goal.id,
      name: goal.name,
      percent,
      remaining,
      isComplete,
      monthsToComplete,
      etaLabel,
      effectiveMonthly,
      targetDateStatus,
      autoContributionPercent: goal.autoContributionPercent,
    }
  })
}
