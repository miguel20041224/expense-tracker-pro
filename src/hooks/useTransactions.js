import { useEffect, useState } from 'react'
import { createBudgetTransaction, isBudgetTransaction } from '../utils/budget'
import { createExpenseTransaction, isExpenseTransaction } from '../utils/expense'
import { normalizeStoredTransactions } from '../utils/movements'
import {
  applyTransactionUpdate,
  updateBudgetTransaction,
  updateExpenseTransaction,
} from '../utils/transactionMutations'

const STORAGE_KEY = 'finance-transactions'

function readStoredTransactions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return normalizeStoredTransactions(parsed)
  } catch {
    return []
  }
}

export function useTransactions() {
  const [transactions, setTransactions] = useState(readStoredTransactions)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeStoredTransactions(transactions)))
  }, [transactions])

  function addExpense(expense) {
    const transaction = createExpenseTransaction(expense)
    setTransactions((prev) => {
      if (prev.some((t) => t.id === transaction.id)) return prev
      return [transaction, ...prev]
    })
    return transaction
  }

  function addBudget({ amount, budgetType, description }) {
    const transaction = createBudgetTransaction({ amount, budgetType, description })
    setTransactions((prev) => {
      if (prev.some((t) => t.id === transaction.id)) return prev
      return [transaction, ...prev]
    })
    return transaction
  }

  function updateTransaction(id, payload) {
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
    setTransactions((prev) => normalizeStoredTransactions(prev.filter((t) => t.id !== id)))
  }

  return {
    transactions,
    addExpense,
    addBudget,
    updateTransaction,
    deleteTransaction,
    isEmpty: transactions.length === 0,
  }
}
