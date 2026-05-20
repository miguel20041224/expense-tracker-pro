/** @type {import('../types').InsightRule[]} */
export const weeklyRules = [
  {
    id: 'weekly-spend-increase',
    priority: 15,
    evaluate(ctx) {
      const { last7DaysExpenses, previous7DaysExpenses } = ctx.temporal
      if (last7DaysExpenses <= 0 || previous7DaysExpenses <= 0) return null

      if (last7DaysExpenses >= previous7DaysExpenses * 1.15) {
        const pct = Math.round(
          ((last7DaysExpenses - previous7DaysExpenses) / previous7DaysExpenses) * 100,
        )
        return {
          id: 'weekly-spend-increase',
          type: 'warning',
          priority: 15,
          category: 'weekly',
          text: `Tus gastos de los últimos 7 días subieron ${pct}% respecto a la semana anterior.`,
        }
      }
      return null
    },
  },
  {
    id: 'weekly-spend-decrease',
    priority: 85,
    evaluate(ctx) {
      const { last7DaysExpenses, previous7DaysExpenses } = ctx.temporal
      if (last7DaysExpenses <= 0 || previous7DaysExpenses <= 0) return null

      if (last7DaysExpenses <= previous7DaysExpenses * 0.85) {
        const pct = Math.round(
          ((previous7DaysExpenses - last7DaysExpenses) / previous7DaysExpenses) * 100,
        )
        return {
          id: 'weekly-spend-decrease',
          type: 'success',
          priority: 85,
          category: 'weekly',
          text: `Bajaste tus gastos ${pct}% esta semana comparado con la semana pasada.`,
        }
      }
      return null
    },
  },
  {
    id: 'weekly-cash-flow-pressure',
    priority: 20,
    evaluate(ctx) {
      const { last7DaysExpenses } = ctx.temporal
      const { summary } = ctx.metrics
      if (summary.income <= 0 || last7DaysExpenses <= 0) return null

      const weeklyIncome = summary.income / 4.33
      if (last7DaysExpenses > weeklyIncome * 1.1) {
        return {
          id: 'weekly-cash-flow-pressure',
          type: 'warning',
          priority: 20,
          category: 'weekly',
          text: 'Tu ritmo de gasto semanal supera lo que podrías gastar según tus ingresos mensuales.',
        }
      }
      return null
    },
  },
]
