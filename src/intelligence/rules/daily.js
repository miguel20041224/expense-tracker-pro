/** @type {import('../types').InsightRule[]} */
export const dailyRules = [
  {
    id: 'daily-spend-spike',
    priority: 10,
    evaluate(ctx) {
      const { todayExpenses, yesterdayExpenses } = ctx.temporal
      if (todayExpenses <= 0) return null

      if (yesterdayExpenses > 0 && todayExpenses >= yesterdayExpenses * 1.2) {
        const pct = Math.round(
          ((todayExpenses - yesterdayExpenses) / yesterdayExpenses) * 100,
        )
        return {
          id: 'daily-spend-spike',
          type: 'warning',
          priority: 10,
          category: 'daily',
          text: `Hoy gastaste más que ayer (+${pct}%). Llevas ${formatMoney(todayExpenses)} en gastos hoy.`,
        }
      }

      if (yesterdayExpenses === 0 && todayExpenses >= 50) {
        return {
          id: 'daily-spend-start',
          type: 'info',
          priority: 25,
          category: 'daily',
          text: `Hoy registraste ${formatMoney(todayExpenses)} en gastos. Ayer no hubo gastos registrados.`,
        }
      }

      return null
    },
  },
  {
    id: 'daily-spend-calm',
    priority: 90,
    evaluate(ctx) {
      const { todayExpenses, yesterdayExpenses } = ctx.temporal
      if (todayExpenses <= 0 || yesterdayExpenses <= 0) return null
      if (todayExpenses <= yesterdayExpenses * 0.7) {
        return {
          id: 'daily-spend-calm',
          type: 'success',
          priority: 90,
          category: 'daily',
          text: 'Hoy llevas menos gasto que ayer. Buen control diario.',
        }
      }
      return null
    },
  },
]

function formatMoney(amount) {
  return new Intl.NumberFormat('es', { maximumFractionDigits: 0 }).format(amount)
}
