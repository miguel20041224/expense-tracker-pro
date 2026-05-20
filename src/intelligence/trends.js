/** Serie de gastos por mes (últimos N meses) para gráficos y reportes. */
export function buildMonthlyExpenseTrend(transactions, months = 6) {
  const now = new Date()
  const points = []

  for (let i = months - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const prefix = d.toISOString().slice(0, 7)
    const label = d.toLocaleDateString('es', { month: 'short', year: '2-digit' })
    const monthTx = transactions.filter((t) => t.date?.startsWith(prefix))
    const income = monthTx
      .filter((t) => t.type === 'budget' || t.type === 'income')
      .reduce((s, t) => s + Math.abs(t.amount), 0)
    const expenses = monthTx
      .filter((t) => t.type === 'expense')
      .reduce((s, t) => s + Math.abs(t.amount), 0)

    points.push({ month: label, income, expenses, savings: income - expenses })
  }

  return points
}
