import { useEffect, useState } from 'react'
import {
  createFinancialGoal,
  distributeIncomeToGoals,
  normalizeGoal,
  normalizeGoals,
} from '../utils/goals'
import { readStorage, writeStorage } from '../utils/storage'

const STORAGE_KEY = 'finance-goals'

export function useFinancialGoals() {
  const [goals, setGoals] = useState(() => normalizeGoals(readStorage(STORAGE_KEY, [])))

  useEffect(() => {
    writeStorage(STORAGE_KEY, normalizeGoals(goals))
  }, [goals])

  function addGoal(payload) {
    const goal = createFinancialGoal(payload)
    setGoals((prev) => [goal, ...prev])
    return goal
  }

  function updateGoal(id, payload) {
    setGoals((prev) =>
      normalizeGoals(
        prev.map((goal) => {
          if (goal.id !== id) return goal
          return normalizeGoal({
            ...goal,
            name: payload.name ?? goal.name,
            targetAmount: payload.targetAmount ?? goal.targetAmount,
            currentAmount: payload.currentAmount ?? goal.currentAmount,
            targetDate: payload.targetDate !== undefined ? payload.targetDate : goal.targetDate,
            autoContributionPercent:
              payload.autoContributionPercent ?? goal.autoContributionPercent,
          })
        }),
      ),
    )
  }

  function deleteGoal(id) {
    setGoals((prev) => prev.filter((g) => g.id !== id))
  }

  function contributeToGoal(id, amount) {
    const value = Math.abs(Number(amount) || 0)
    if (!value) return

    setGoals((prev) =>
      normalizeGoals(
        prev.map((goal) => {
          if (goal.id !== id) return goal
          const next = goal.currentAmount + value
          return {
            ...goal,
            currentAmount:
              goal.targetAmount > 0 ? Math.min(next, goal.targetAmount) : next,
          }
        }),
      ),
    )
  }

  function applyIncomeContributions(incomeAmount) {
    if (!incomeAmount || incomeAmount <= 0) return
    setGoals((prev) => normalizeGoals(distributeIncomeToGoals(prev, incomeAmount)))
  }

  return {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    contributeToGoal,
    applyIncomeContributions,
    isEmpty: goals.length === 0,
  }
}
