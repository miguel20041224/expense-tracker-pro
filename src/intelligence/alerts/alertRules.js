import { formatMoney } from '../rules/helpers'

/** @typedef {import('../types').Insight} Insight */

/**
 * @param {import('../types').FinancialContext} ctx
 * @returns {Array<Insight & { periodKey: string, source: string }>}
 */
export function runAlertRules(ctx) {
  const alerts = []
  const { temporal, metrics, debts, categoriesCurrent } = ctx
  const { summary, creditUsagePercent, cardStats } = metrics
  const monthKey = temporal.currentMonthPrefix
  const dayOfMonth = Number(temporal.today.slice(8, 10))

  if (summary.isOverBudget && summary.hasExpenses) {
    alerts.push({
      id: 'critical-balance',
      type: 'danger',
      priority: 5,
      category: 'balance',
      periodKey: monthKey,
      source: 'alert',
      text: 'Saldo crítico: tus gastos del mes superan tus ingresos asignados.',
    })
  }

  if (summary.income > 0 && summary.expenses / summary.income >= 0.95 && summary.hasExpenses) {
    alerts.push({
      id: 'spending-pace-critical',
      type: 'danger',
      priority: 6,
      category: 'balance',
      periodKey: monthKey,
      source: 'alert',
      text: 'Llevas el 95% o más de tus ingresos ya comprometidos en gastos este mes.',
    })
  }

  const excessCategory = categoriesCurrent.find((c) => c.percent >= 50)
  if (excessCategory) {
    alerts.push({
      id: 'category-excess',
      type: 'warning',
      priority: 12,
      category: 'habits',
      periodKey: monthKey,
      source: 'alert',
      text: `Exceso en "${excessCategory.name}": el ${excessCategory.percent}% de tus gastos del mes.`,
      params: { categoryName: excessCategory.name, percent: excessCategory.percent },
    })
  }

  const totalMin = metrics.snowball.totalMinimum
  const activeDebts = debts.filter((d) => d.balance > 0 && d.minPayment > 0)
  if (activeDebts.length > 0 && dayOfMonth >= 20) {
    alerts.push({
      id: 'upcoming-debt-payments',
      type: 'warning',
      priority: 14,
      category: 'debt',
      periodKey: monthKey,
      source: 'alert',
      text: `Próximas cuotas: ${activeDebts.length} deuda(s) con pagos mínimos de ~${formatMoney(totalMin)} este mes.`,
      params: { count: activeDebts.length, totalMin: formatMoney(totalMin) },
    })
  }

  if (summary.income > 0 && summary.savings < summary.income * 0.05 && summary.hasExpenses) {
    alerts.push({
      id: 'low-savings',
      type: 'warning',
      priority: 18,
      category: 'balance',
      periodKey: monthKey,
      source: 'alert',
      text: 'Falta de ahorro: te queda menos del 5% de tus ingresos disponibles este mes.',
    })
  }

  const urgentCard = cardStats.find((c) => c.stats.usagePercent >= 85)
  if (urgentCard) {
    const usagePercent = Math.round(urgentCard.stats.usagePercent)
    alerts.push({
      id: 'credit-limit-critical',
      type: 'danger',
      priority: 9,
      category: 'credit',
      periodKey: monthKey,
      source: 'alert',
      text: `Tarjeta ${urgentCard.card.name} al ${usagePercent}%: riesgo de límite agotado.`,
      params: { cardName: urgentCard.card.name, usagePercent },
    })
  } else if (creditUsagePercent >= 75) {
    const usagePercent = Math.round(creditUsagePercent)
    alerts.push({
      id: 'credit-usage-high',
      type: 'warning',
      priority: 16,
      category: 'credit',
      periodKey: monthKey,
      source: 'alert',
      text: `Uso agregado de crédito al ${usagePercent}%. Considera reducir cargos.`,
      params: { usagePercent },
    })
  }

  const topGrowth = ctx.categoryGrowth[0]
  if (topGrowth && topGrowth.growthPercent >= 35) {
    const growthPercent = Math.round(topGrowth.growthPercent)
    alerts.push({
      id: 'category-spike',
      type: 'warning',
      priority: 17,
      category: 'habits',
      periodKey: monthKey,
      source: 'alert',
      text: `Comportamiento riesgoso: "${topGrowth.name}" creció ${growthPercent}% vs el mes anterior.`,
      params: { categoryName: topGrowth.name, growthPercent },
    })
  }

  if (ctx.microSpends.sharePercent >= 18 && ctx.microSpends.count >= 5) {
    const sharePercent = Math.round(ctx.microSpends.sharePercent)
    alerts.push({
      id: 'micro-spend-alert',
      type: 'info',
      priority: 30,
      category: 'habits',
      periodKey: monthKey,
      source: 'alert',
      text: `Gastos hormiga acumulados: ${ctx.microSpends.count} movimientos pequeños (${sharePercent}% del gasto).`,
      params: { count: ctx.microSpends.count, sharePercent },
    })
  }

  return alerts
}

/**
 * Promueve insights urgentes a alertas del centro.
 * @param {Insight[]} insights
 * @param {import('../types').FinancialContext} ctx
 */
export function insightsToAlerts(insights, ctx) {
  const monthKey = ctx.temporal.currentMonthPrefix
  const dayKey = ctx.temporal.today

  return insights
    .filter((i) => i.type === 'danger' || (i.type === 'warning' && (i.priority ?? 50) <= 25))
    .map((i) => ({
      ...i,
      periodKey: i.category === 'daily' ? dayKey : monthKey,
      source: 'insight',
    }))
}
