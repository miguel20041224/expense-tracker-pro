/** Filtra transacciones del mes calendario actual (YYYY-MM). */
export function filterCurrentMonth(transactions) {
  const prefix = new Date().toISOString().slice(0, 7)
  return transactions.filter((t) => t.date?.startsWith(prefix))
}

/** Resumen financiero derivado únicamente de movimientos del usuario. */
export function computeSummary(transactions) {
  const monthTx = filterCurrentMonth(transactions)

  const income = monthTx
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const expenses = monthTx
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const savingsTransfers = monthTx
    .filter((t) => t.type === 'savings')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const savings = Math.max(income - expenses - savingsTransfers, 0)
  const balance = monthTx.reduce((sum, t) => sum + t.amount, 0)
  const savingsGoal = income > 0 ? income * 0.2 : expenses > 0 ? expenses * 0.15 : 0

  return {
    balance,
    income,
    expenses,
    savings,
    savingsGoal,
  }
}

/** Desglose por categoría a partir de gastos reales del mes. */
export function computeCategories(transactions) {
  const monthExpenses = filterCurrentMonth(transactions).filter((t) => t.type === 'expense')

  const totals = monthExpenses.reduce((acc, t) => {
    const key = t.category || 'Otros'
    acc[key] = (acc[key] || 0) + Math.abs(t.amount)
    return acc
  }, {})

  const grandTotal = Object.values(totals).reduce((sum, n) => sum + n, 0)
  if (grandTotal === 0) return []

  return Object.entries(totals)
    .map(([name, amount]) => ({
      name,
      amount,
      percent: Math.round((amount / grandTotal) * 100),
    }))
    .sort((a, b) => b.amount - a.amount)
}

export function hasExpenseData(transactions) {
  return filterCurrentMonth(transactions).some((t) => t.type === 'expense')
}

export function hasSavingsData(summary) {
  return summary.income > 0 || summary.savings > 0
}
