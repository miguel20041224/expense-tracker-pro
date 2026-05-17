import { useEffect, useState } from 'react'
import { createBudgetTransaction } from '../utils/budget'
import { createExpenseTransaction } from '../utils/expense'
import { normalizeStoredTransactions } from '../utils/movements'

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

  return {
    transactions,
    addExpense,
    addBudget,
    isEmpty: transactions.length === 0,
  }
}
