import { useEffect, useState } from 'react'
import { createBudgetTransaction } from '../utils/budget'

const STORAGE_KEY = 'finance-transactions'

function readStoredTransactions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function useTransactions() {
  const [transactions, setTransactions] = useState(readStoredTransactions)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
  }, [transactions])

  function addTransaction(transaction) {
    setTransactions((prev) => [transaction, ...prev])
  }

  function addBudget({ amount, budgetType, description }) {
    const transaction = createBudgetTransaction({ amount, budgetType, description })
    setTransactions((prev) => [transaction, ...prev])
    return transaction
  }

  return {
    transactions,
    addTransaction,
    addBudget,
    isEmpty: transactions.length === 0,
  }
}
