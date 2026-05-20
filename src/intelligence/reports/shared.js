import {
  computeCategoriesFromTransactions,
  filterExpenses,
  sumExpensesInRange,
  toDateKey,
} from '../rules/helpers'

export function formatReportDate(date = new Date()) {
  return date.toLocaleDateString('es', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatShortDate(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('es', { day: 'numeric', month: 'short' })
}

export function filterTransactionsInRange(transactions, fromKey, toKey) {
  return transactions.filter((t) => {
    const d = t.date?.slice(0, 10)
    return d && d >= fromKey && d <= toKey
  })
}

export function sumIncomeInRange(transactions, fromKey, toKey) {
  return transactions
    .filter((t) => {
      const d = t.date?.slice(0, 10)
      return d && d >= fromKey && d <= toKey && (t.type === 'budget' || t.type === 'income')
    })
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
}

export function countMovements(transactions, fromKey, toKey) {
  return filterTransactionsInRange(transactions, fromKey, toKey).length
}

export function percentChange(current, previous) {
  if (previous <= 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

export function pickTips(insights, limit = 4) {
  return (insights ?? [])
    .filter((i) => i.type === 'danger' || i.type === 'warning' || i.type === 'success')
    .slice(0, limit)
    .map((i) => i.text)
}

export function buildCategorySection(transactions, fromKey, toKey, limit = 5) {
  const inRange = filterTransactionsInRange(transactions, fromKey, toKey)
  return computeCategoriesFromTransactions(inRange).slice(0, limit)
}

export function topExpensesToday(transactions, dateKey, limit = 5) {
  return filterExpenses(transactions)
    .filter((t) => t.date?.startsWith(dateKey))
    .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
    .slice(0, limit)
    .map((t) => ({
      label: t.description || t.category || 'Gasto',
      category: t.category || 'Otros',
      amount: Math.abs(t.amount),
    }))
}

export function buildDailyExpenseSeries(transactions, days = 7) {
  const now = new Date()
  const points = []
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = toDateKey(d)
    points.push({
      date: key,
      label: d.toLocaleDateString('es', { weekday: 'short' }),
      expenses: sumExpensesInRange(transactions, (date) => date === key),
    })
  }
  return points
}

export function projectMonthEndSavings(summary, dayOfMonth, daysInMonth) {
  if (dayOfMonth <= 0 || summary.income <= 0) return null
  const dailySavings = summary.savings / dayOfMonth
  const projected = dailySavings * daysInMonth
  return {
    projected,
    dailySavings,
    daysRemaining: daysInMonth - dayOfMonth,
  }
}
