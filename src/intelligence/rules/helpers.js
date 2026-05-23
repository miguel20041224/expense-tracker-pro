/** @param {Date} date */
export function toDateKey(date) {
  return date.toISOString().slice(0, 10)
}

/** @param {string} dateKey YYYY-MM-DD */
export function parseDateKey(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** @param {Array} transactions */
export function filterExpenses(transactions) {
  return transactions.filter((t) => t.type === 'expense')
}

/** @param {Array} transactions @param {string} dateKey */
export function sumExpensesOnDate(transactions, dateKey) {
  return filterExpenses(transactions)
    .filter((t) => t.date?.startsWith(dateKey))
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
}

/**
 * @param {Array} transactions
 * @param {(dateKey: string) => boolean} predicate
 */
export function sumExpensesInRange(transactions, predicate) {
  return filterExpenses(transactions)
    .filter((t) => t.date && predicate(t.date.slice(0, 10)))
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
}

/** @param {Array} transactions — solo gastos del array dado */
export function computeCategoriesFromTransactions(transactions) {
  const monthExpenses = filterExpenses(transactions)
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

/**
 * @param {Array} current
 * @param {Array} previous
 */
export function computeCategoryGrowth(current, previous) {
  const prevMap = new Map(previous.map((c) => [c.name, c.amount]))
  const growth = []

  for (const cat of current) {
    const prevAmount = prevMap.get(cat.name) ?? 0
    if (cat.amount < 30) continue
    if (prevAmount <= 0) {
      if (cat.amount >= 100) {
        growth.push({
          name: cat.name,
          current: cat.amount,
          previous: 0,
          growthPercent: 100,
        })
      }
      continue
    }
    const growthPercent = ((cat.amount - prevAmount) / prevAmount) * 100
    if (growthPercent >= 20) {
      growth.push({
        name: cat.name,
        current: cat.amount,
        previous: prevAmount,
        growthPercent,
      })
    }
  }

  return growth.sort((a, b) => b.growthPercent - a.growthPercent)
}

export { formatLocaleAmount as formatMoney } from '../../i18n/localizeMessage'
