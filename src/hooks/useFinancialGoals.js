import { useEffect, useRef, useState } from 'react'
import {
  createFinancialGoal,
  distributeIncomeToGoals,
  normalizeGoal,
  normalizeGoals,
} from '../utils/goals'
import { subscribeFinancialData } from '../services/firestore/financialDataRepository'
import { saveClientGoals } from '../services/financialDataService'
import { canWriteFinancialData } from '../utils/auth/permissions'

function resolveUserId(actor) {
  return actor?.uid ?? actor?.id
}

export function useFinancialGoals(actor, options = {}) {
  const userId = resolveUserId(actor)
  const readOnly = options.readOnly ?? !canWriteFinancialData(actor, userId)
  const suppressWrite = useRef(true)

  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setGoals([])
      setLoading(false)
      return undefined
    }

    setLoading(true)
    suppressWrite.current = true

    const unsubscribe = subscribeFinancialData(userId, (data) => {
      suppressWrite.current = true
      setGoals(normalizeGoals(data.goals))
      setLoading(false)
    })

    return unsubscribe
  }, [userId])

  useEffect(() => {
    if (!userId || readOnly || loading) return undefined

    if (suppressWrite.current) {
      suppressWrite.current = false
      return undefined
    }

    const timer = setTimeout(() => {
      saveClientGoals(actor, userId, goals).catch((err) => {
        console.error('Error guardando metas:', err)
      })
    }, 450)

    return () => clearTimeout(timer)
  }, [goals, userId, readOnly, loading, actor])

  function guardWrite(fn) {
    return (...args) => {
      if (readOnly) return undefined
      return fn(...args)
    }
  }

  const addGoal = guardWrite((payload) => {
    const goal = createFinancialGoal(payload)
    setGoals((prev) => [goal, ...prev])
    return goal
  })

  const updateGoal = guardWrite((id, payload) => {
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
  })

  const deleteGoal = guardWrite((id) => {
    setGoals((prev) => prev.filter((g) => g.id !== id))
  })

  const contributeToGoal = guardWrite((id, amount) => {
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
  })

  const applyIncomeContributions = guardWrite((incomeAmount) => {
    if (!incomeAmount || incomeAmount <= 0) return
    setGoals((prev) => normalizeGoals(distributeIncomeToGoals(prev, incomeAmount)))
  })

  return {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    contributeToGoal,
    applyIncomeContributions,
    isEmpty: !loading && goals.length === 0,
    loading,
    readOnly,
  }
}
