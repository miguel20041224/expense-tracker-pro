import { periodToMonthlyAmount } from './incomeBudget'

/** Filtra transacciones del mes calendario actual (YYYY-MM). */
export function filterCurrentMonth(transactions) {
  const prefix = new Date().toISOString().slice(0, 7)
  return transactions.filter((t) => t.date?.startsWith(prefix))
}

function sumByType(transactions, type, absolute = false) {
  return transactions
    .filter((t) => t.type === type)
    .reduce((sum, t) => {
      const amount = absolute ? Math.abs(t.amount) : t.amount
      return sum + amount
    }, 0)
}

/** Total de presupuestos asignados en el mes (legacy). */
export function sumBudgets(transactions) {
  return sumByType(filterCurrentMonth(transactions), 'budget', true)
}

/** Total de otros ingresos explícitos (si existen). */
export function sumOtherIncome(transactions) {
  return sumByType(filterCurrentMonth(transactions), 'income', true)
}

/** Total de gastos del mes (valores positivos). */
export function sumExpenses(transactions) {
  return sumByType(filterCurrentMonth(transactions), 'expense', true)
}

/**
 * Resumen financiero derivado de movimientos + ingreso configurado opcional.
 * @param {Array} transactions
 * @param {{ type?: string, amount?: number } | null} [incomeConfig]
 */
export function computeSummary(transactions, incomeConfig = null) {
  const monthTx = filterCurrentMonth(transactions)

  const legacyBudgets = sumByType(monthTx, 'budget', true)
  const otherIncome = sumByType(monthTx, 'income', true)

  let configuredIncome = 0
  if (incomeConfig?.amount > 0) {
    configuredIncome = periodToMonthlyAmount(
      incomeConfig.type ?? 'monthly',
      incomeConfig.amount,
    )
  }

  const budgets = legacyBudgets
  const income = configuredIncome + legacyBudgets + otherIncome

  const expenses = sumByType(monthTx, 'expense', true)

  const savingsTransfers = sumByType(monthTx, 'savings', true)

  const balance = income - expenses - savingsTransfers
  const savings = balance

  return {
    income,
    configuredIncome,
    budgets,
    legacyBudgets,
    otherIncome,
    expenses,
    savings,
    balance,
    savingsTransfers,
    hasActivity: monthTx.length > 0,
    hasBudgets: income > 0,
    hasConfiguredIncome: configuredIncome > 0,
    hasExpenses: expenses > 0,
    isOverBudget: balance < 0,
  }
}

/** Desglose por categoría solo con gastos reales del mes. */
export function computeCategories(transactions) {
  const monthExpenses = filterCurrentMonth(transactions).filter((t) => t.type === 'expense')

  const totals = monthExpenses.reduce((acc, t) => {
    const key = t.category?.trim() || 'Otros'
    acc[key] = (acc[key] || 0) + Math.abs(t.amount)
    return acc
  }, {})

  const grandTotal = Object.values(totals).reduce((sum, n) => sum + n, 0)
  if (grandTotal === 0) return []

  const entries = Object.entries(totals).map(([name, amount]) => ({
    name,
    amount,
    rawPercent: (amount / grandTotal) * 100,
    percent: 0,
  }))

  entries.forEach((entry) => {
    entry.percent = Math.floor(entry.rawPercent)
  })

  let allocated = entries.reduce((sum, e) => sum + e.percent, 0)
  const byRemainder = [...entries].sort((a, b) => (b.rawPercent % 1) - (a.rawPercent % 1))

  let index = 0
  while (allocated < 100 && byRemainder.length > 0) {
    byRemainder[index % byRemainder.length].percent += 1
    allocated += 1
    index += 1
  }

  return entries
    .map(({ name, amount, percent }) => ({ name, amount, percent }))
    .sort((a, b) => b.amount - a.amount)
}

export function hasExpenseData(transactions) {
  return sumExpenses(transactions) > 0
}

export function hasBudgetData(transactions, incomeConfig = null) {
  return (
    sumBudgets(transactions) > 0 ||
    sumOtherIncome(transactions) > 0 ||
    (incomeConfig?.amount ?? 0) > 0
  )
}
