import { createTransactionId } from './movements'

export function createGoalId() {
  return createTransactionId()
}

export function createFinancialGoal({
  name,
  targetAmount,
  currentAmount = 0,
  targetDate,
  autoContributionPercent = 0,
}) {
  return {
    id: createGoalId(),
    name: name.trim(),
    targetAmount: Math.abs(Number(targetAmount) || 0),
    currentAmount: Math.max(0, Number(currentAmount) || 0),
    targetDate: targetDate || null,
    autoContributionPercent: Math.min(
      100,
      Math.max(0, Number(autoContributionPercent) || 0),
    ),
    createdAt: new Date().toISOString(),
  }
}

export function normalizeGoal(goal) {
  if (!goal || typeof goal !== 'object') return null
  if (!goal.id || !goal.name) return null

  const targetAmount = Math.max(0, Number(goal.targetAmount) || 0)
  const currentAmount = Math.min(
    targetAmount || Infinity,
    Math.max(0, Number(goal.currentAmount) || 0),
  )

  return {
    ...goal,
    name: String(goal.name).trim(),
    targetAmount,
    currentAmount,
    targetDate: goal.targetDate || null,
    autoContributionPercent: Math.min(
      100,
      Math.max(0, Number(goal.autoContributionPercent) || 0),
    ),
  }
}

export function normalizeGoals(goals) {
  if (!Array.isArray(goals)) return []
  return goals.map(normalizeGoal).filter(Boolean)
}

export function computeGoalProgress(goal) {
  const target = goal.targetAmount
  const current = goal.currentAmount
  const percent = target > 0 ? Math.min((current / target) * 100, 100) : 0
  const remaining = Math.max(target - current, 0)

  return { percent, remaining, isComplete: target > 0 && current >= target }
}

export function getGoalStatus(goal) {
  const { isComplete } = computeGoalProgress(goal)

  if (isComplete) {
    return { id: 'completed', label: 'Completada', variant: 'positive' }
  }

  if (goal.targetDate) {
    const target = new Date(`${goal.targetDate}T23:59:59`)
    if (!Number.isNaN(target.getTime()) && target < new Date()) {
      return { id: 'overdue', label: 'Atrasada', variant: 'negative' }
    }
  }

  return { id: 'in_progress', label: 'En progreso', variant: 'neutral' }
}

export function distributeIncomeToGoals(goals, incomeAmount) {
  if (!incomeAmount || incomeAmount <= 0) return goals

  return goals.map((goal) => {
    const percent = goal.autoContributionPercent
    if (!percent) return goal

    const contribution = (incomeAmount * percent) / 100
    const nextAmount = Math.min(
      goal.targetAmount || goal.currentAmount + contribution,
      goal.currentAmount + contribution,
    )

    return { ...goal, currentAmount: nextAmount }
  })
}
