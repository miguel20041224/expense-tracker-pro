import { useMemo } from 'react'

/** Objeto estable para reportes, proyecciones y análisis (evita invalidar memo por referencia nueva). */
export function useStableFinancialData({
  transactions,
  creditCards,
  goals,
  debts,
  income,
}) {
  return useMemo(
    () => ({
      transactions,
      creditCards,
      goals,
      debts,
      income,
    }),
    [transactions, creditCards, goals, debts, income],
  )
}
