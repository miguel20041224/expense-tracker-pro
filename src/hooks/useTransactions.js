import { useEffect, useMemo, useRef, useState } from 'react'
import { createBudgetTransaction, isBudgetTransaction } from '../utils/budget'
import { createExpenseTransaction, isExpenseTransaction } from '../utils/expense'
import { countFavoriteMovements, toggleFavoriteFlag } from '../utils/movementFlags'
import { normalizeStoredTransactions } from '../utils/movements'
import {
  applyTransactionUpdate,
  updateBudgetTransaction,
  updateExpenseTransaction,
} from '../utils/transactionMutations'
import { subscribeFinancialData } from '../services/firestore/financialDataRepository'
import { saveClientTransactions } from '../services/financialDataService'
import { canWriteFinancialData } from '../utils/auth/permissions'

function resolveUserId(actor) {
  return actor?.uid ?? actor?.id
}

export function useTransactions(actor, options = {}) {
  const userId = resolveUserId(actor)
  const readOnly = options.readOnly ?? !canWriteFinancialData(actor, userId)
  const suppressWrite = useRef(true)

  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setTransactions([])
      setLoading(false)
      return undefined
    }

    setLoading(true)
    suppressWrite.current = true

    const unsubscribe = subscribeFinancialData(userId, (data) => {
      suppressWrite.current = true
      setTransactions(normalizeStoredTransactions(data.transactions))
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
      saveClientTransactions(actor, userId, transactions).catch((err) => {
        console.error('Error guardando transacciones:', err)
      })
    }, 450)

    return () => clearTimeout(timer)
  }, [transactions, userId, readOnly, loading, actor])

  function guardWrite(fn) {
    return (...args) => {
      if (readOnly) return undefined
      return fn(...args)
    }
  }

  const addExpense = guardWrite((expense) => {
    const transaction = createExpenseTransaction(expense)
    setTransactions((prev) => {
      if (prev.some((t) => t.id === transaction.id)) return prev
      return [transaction, ...prev]
    })
    return transaction
  })

  const addBudget = guardWrite(({ amount, budgetType, description }) => {
    const transaction = createBudgetTransaction({ amount, budgetType, description })
    setTransactions((prev) => {
      if (prev.some((t) => t.id === transaction.id)) return prev
      return [transaction, ...prev]
    })
    return transaction
  })

  function updateTransaction(id, payload) {
    if (readOnly) return
    setTransactions((prev) => {
      const current = prev.find((t) => t.id === id)
      if (!current) return prev

      let didChange = false

      const updated = applyTransactionUpdate(prev, id, (transaction) => {
        let next = null
        if (isExpenseTransaction(transaction)) {
          next = updateExpenseTransaction(transaction, payload)
        } else if (isBudgetTransaction(transaction)) {
          next = updateBudgetTransaction(transaction, payload)
        }
        if (next && next !== transaction) didChange = true
        return next
      })

      if (!didChange) return prev

      return normalizeStoredTransactions(updated)
    })
  }

  function deleteTransaction(id) {
    if (readOnly) return
    setTransactions((prev) => normalizeStoredTransactions(prev.filter((t) => t.id !== id)))
  }

  function toggleFavorite(id) {
    if (readOnly) return
    setTransactions((prev) => {
      const index = prev.findIndex((t) => t.id === id)
      if (index === -1) return prev

      const next = [...prev]
      next[index] = toggleFavoriteFlag(prev[index])
      return normalizeStoredTransactions(next)
    })
  }

  return {
    transactions,
    addExpense,
    addBudget,
    updateTransaction,
    deleteTransaction,
    toggleFavorite,
    favoriteCount: useMemo(() => countFavoriteMovements(transactions), [transactions]),
    isEmpty: !loading && transactions.length === 0,
    loading,
    readOnly,
  }
}
