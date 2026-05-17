import { useEffect, useState } from 'react'
import { createDebt, normalizeDebts } from '../utils/debts'
import { readStorage, writeStorage } from '../utils/storage'

const STORAGE_KEY = 'finance-debts'

export function useDebts() {
  const [debts, setDebts] = useState(() => normalizeDebts(readStorage(STORAGE_KEY, [])))

  useEffect(() => {
    writeStorage(STORAGE_KEY, normalizeDebts(debts))
  }, [debts])

  function addDebt(payload) {
    const debt = createDebt(payload)
    setDebts((prev) => [debt, ...prev])
    return debt
  }

  function updateDebt(id, payload) {
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
  }

  function deleteDebt(id) {
    setDebts((prev) => prev.filter((d) => d.id !== id))
  }

  return {
    debts,
    addDebt,
    updateDebt,
    deleteDebt,
    isEmpty: debts.length === 0,
  }
}
