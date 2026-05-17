import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { subscribeFinancialData } from '../services/firestore/financialDataRepository'
import { saveClientIncome } from '../services/financialDataService'
import { canWriteFinancialData } from '../utils/auth/permissions'
import {
  computeBudgetOverview,
  normalizeIncomeConfig,
} from '../utils/incomeBudget'

function resolveUserId(actor) {
  return actor?.uid ?? actor?.id
}

export function useIncomeBudget(actor) {
  const userId = resolveUserId(actor)
  const readOnly = !canWriteFinancialData(actor, userId)
  const suppressWrite = useRef(true)

  const [income, setIncome] = useState(normalizeIncomeConfig(null))
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setIncome(normalizeIncomeConfig(null))
      setTransactions([])
      setLoading(false)
      return undefined
    }

    setLoading(true)
    suppressWrite.current = true

    const unsubscribe = subscribeFinancialData(userId, (data) => {
      suppressWrite.current = true
      setIncome(normalizeIncomeConfig(data.income))
      setTransactions(data.transactions ?? [])
      setLoading(false)
    })

    return unsubscribe
  }, [userId])

  const overview = useMemo(
    () => computeBudgetOverview(transactions, income),
    [transactions, income],
  )

  const saveIncome = useCallback(
    async (nextIncome) => {
      if (readOnly || !userId) {
        throw new Error('No tienes permiso para modificar el ingreso.')
      }
      const normalized = normalizeIncomeConfig(nextIncome)
      await saveClientIncome(actor, userId, normalized)
      setIncome(normalized)
    },
    [actor, userId, readOnly],
  )

  return {
    income,
    overview,
    loading,
    readOnly,
    saveIncome,
  }
}
