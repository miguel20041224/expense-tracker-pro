import { useEffect, useRef, useState } from 'react'
import { createDebt, normalizeDebt, normalizeDebts } from '../utils/debts'
import { subscribeFinancialData } from '../services/firestore/financialDataRepository'
import { saveClientDebts } from '../services/financialDataService'
import { canWriteFinancialData } from '../utils/auth/permissions'

function resolveUserId(actor) {
  return actor?.uid ?? actor?.id
}

export function useDebts(actor, options = {}) {
  const userId = resolveUserId(actor)
  const readOnly = options.readOnly ?? !canWriteFinancialData(actor, userId)
  const suppressWrite = useRef(true)

  const [debts, setDebts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setDebts([])
      setLoading(false)
      return undefined
    }

    setLoading(true)
    suppressWrite.current = true

    const unsubscribe = subscribeFinancialData(userId, (data) => {
      suppressWrite.current = true
      setDebts(normalizeDebts(data.debts))
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
      saveClientDebts(actor, userId, debts).catch((err) => {
        console.error('Error guardando deudas:', err)
      })
    }, 450)

    return () => clearTimeout(timer)
  }, [debts, userId, readOnly, loading, actor])

  function guardWrite(fn) {
    return (...args) => {
      if (readOnly) return undefined
      return fn(...args)
    }
  }

  const addDebt = guardWrite((payload) => {
    const debt = createDebt(payload)
    setDebts((prev) => [debt, ...prev])
    return debt
  })

  const updateDebt = guardWrite((id, payload) => {
    setDebts((prev) =>
      normalizeDebts(
        prev.map((debt) => {
          if (debt.id !== id) return debt
          return normalizeDebt({
            ...debt,
            name: payload.name ?? debt.name,
            balance: payload.balance ?? debt.balance,
            interestRate:
              payload.interestRate !== undefined ? payload.interestRate : debt.interestRate,
            minPayment: payload.minPayment ?? debt.minPayment,
          })
        }),
      ),
    )
  })

  const deleteDebt = guardWrite((id) => {
    setDebts((prev) => prev.filter((d) => d.id !== id))
  })

  return {
    debts,
    addDebt,
    updateDebt,
    deleteDebt,
    isEmpty: !loading && debts.length === 0,
    loading,
    readOnly,
  }
}
