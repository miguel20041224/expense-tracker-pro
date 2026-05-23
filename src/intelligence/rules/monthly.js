/** @type {import('../types').InsightRule[]} */
export const monthlyRules = [
  {
    id: 'leisure-high',
    priority: 30,
    evaluate(ctx) {
      const { leisurePercent, summary } = ctx.metrics
      if (leisurePercent >= 70 && summary.expenses > 0) {
        const pct = Math.round(leisurePercent)
        return {
          id: 'leisure-high',
          type: 'warning',
          priority: 30,
          category: 'monthly',
          text: `Estás gastando más del ${pct}% en ocio y entretenimiento este mes.`,
          params: { pct },
        }
      }
      if (leisurePercent >= 50 && summary.expenses > 0) {
        const pct = Math.round(leisurePercent)
        return {
          id: 'leisure-moderate',
          type: 'info',
          priority: 45,
          category: 'monthly',
          text: `El ${pct}% de tus gastos del mes corresponde a categorías de ocio.`,
          params: { pct },
        }
      }
      return null
    },
  },
  {
    id: 'risk-level',
    priority: 12,
    evaluate(ctx) {
      if (ctx.metrics.riskLevel === 'alto') {
        return {
          id: 'risk-level',
          type: 'danger',
          priority: 12,
          category: 'monthly',
          text: 'Alto riesgo de sobreendeudamiento. Revisa gastos, crédito y deudas con prioridad.',
        }
      }
      if (ctx.metrics.riskLevel === 'medio') {
        return {
          id: 'risk-moderate',
          type: 'warning',
          priority: 35,
          category: 'monthly',
          text: 'Riesgo financiero moderado: conviene reforzar ahorro y control de deuda.',
        }
      }
      return null
    },
  },
  {
    id: 'over-budget',
    priority: 8,
    evaluate(ctx) {
      if (!ctx.metrics.summary.isOverBudget) return null
      return {
        id: 'over-budget',
        type: 'danger',
        priority: 8,
        category: 'monthly',
        text: 'Superaste tu presupuesto mensual. Tus gastos superan los ingresos asignados.',
      }
    },
  },
  {
    id: 'debt-to-income',
    priority: 14,
    evaluate(ctx) {
      const { debtToIncome, totalDebt } = ctx.metrics
      if (debtToIncome > 50 && totalDebt > 0) {
        const pct = Math.round(debtToIncome)
        return {
          id: 'debt-to-income-high',
          type: 'warning',
          priority: 14,
          category: 'monthly',
          text: `Tu deuda total representa el ${pct}% de tus ingresos mensuales.`,
          params: { pct },
        }
      }
      if (debtToIncome > 40 && totalDebt > 0) {
        const pct = Math.round(debtToIncome)
        return {
          id: 'debt-to-income',
          type: 'warning',
          priority: 16,
          category: 'monthly',
          text: `Tu deuda ya supera el 40% de tus ingresos (${pct}%).`,
          params: { pct },
        }
      }
      return null
    },
  },
  {
    id: 'credit-usage',
    priority: 11,
    evaluate(ctx) {
      const { creditUsagePercent } = ctx.metrics
      if (creditUsagePercent <= 80) return null
      const pct = Math.round(creditUsagePercent)
      return {
        id: 'credit-usage',
        type: 'danger',
        priority: 11,
        category: 'monthly',
        text: `Uso de crédito muy alto (${pct}%). Riesgo de impago en tarjetas.`,
        params: { pct },
      }
    },
  },
  {
    id: 'category-concentration',
    priority: 40,
    evaluate(ctx) {
      const top = ctx.metrics.categories[0]
      if (!top || top.percent < 45) return null
      return {
        id: 'category-concentration',
        type: 'info',
        priority: 40,
        category: 'monthly',
        text: `Concentración en "${top.name}": ${top.percent}% del gasto mensual.`,
        params: { name: top.name, pct: top.percent },
      }
    },
  },
  {
    id: 'card-priority',
    priority: 25,
    evaluate(ctx) {
      const priorityCard = ctx.metrics.cardStats.find((c) => c.stats.usagePercent >= 75)
      if (priorityCard) {
        const pct = Math.round(priorityCard.stats.usagePercent)
        return {
          id: 'card-priority',
          type: 'warning',
          priority: 25,
          category: 'monthly',
          text: `Prioriza el pago de la tarjeta ${priorityCard.card.name} (${pct}% de uso).`,
          params: { cardName: priorityCard.card.name, pct },
        }
      }
      const { snowball } = ctx.metrics
      if (snowball.priority) {
        return {
          id: 'snowball-priority',
          type: 'info',
          priority: 42,
          category: 'monthly',
          text: `Prioriza la deuda "${snowball.priority.name}" con el método bola de nieve.`,
          params: { name: snowball.priority.name },
        }
      }
      return null
    },
  },
  {
    id: 'savings-positive',
    priority: 70,
    evaluate(ctx) {
      const { summary } = ctx.metrics
      if (summary.income > 0 && summary.savings > 0) {
        const pct = Math.round((summary.savings / summary.income) * 100)
        return {
          id: 'savings-positive',
          type: 'success',
          priority: 70,
          category: 'monthly',
          text: `Ahorro mensual estimado: ${pct}% de tus ingresos.`,
          params: { pct },
        }
      }
      if (summary.income > 0 && summary.savings <= 0 && summary.hasExpenses) {
        return {
          id: 'savings-none',
          type: 'warning',
          priority: 28,
          category: 'monthly',
          text: 'No te queda margen de ahorro este mes. Revisa gastos hormiga y categorías recurrentes.',
        }
      }
      return null
    },
  },
  {
    id: 'debt-min-payments',
    priority: 24,
    evaluate(ctx) {
      const { snowball, summary } = ctx.metrics
      const totalMin = snowball.totalMinimum
      if (totalMin <= 0 || summary.income <= 0) return null
      const pct = Math.round((totalMin / summary.income) * 100)
      if (pct >= 35) {
        return {
          id: 'debt-min-payments',
          type: 'warning',
          priority: 24,
          category: 'debt',
          text: `Tus pagos mínimos de deuda consumen el ${pct}% de tus ingresos mensuales.`,
          params: { pct },
        }
      }
      return null
    },
  },
]
