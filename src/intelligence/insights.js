/** Genera insights automáticos basados en reglas (sin IA externa). */
export function generateFinancialInsights(metrics) {
  const insights = []
  const {
    summary,
    categories,
    leisurePercent,
    debtToIncome,
    creditUsagePercent,
    snowball,
    cardStats,
  } = metrics

  if (leisurePercent >= 70 && summary.expenses > 0) {
    insights.push({
      type: 'warning',
      text: `Estás gastando más del ${Math.round(leisurePercent)}% en ocio y entretenimiento este mes.`,
    })
  } else if (leisurePercent >= 50 && summary.expenses > 0) {
    insights.push({
      type: 'info',
      text: `El ${Math.round(leisurePercent)}% de tus gastos del mes corresponde a categorías de ocio.`,
    })
  }

  if (metrics.riskLevel === 'alto') {
    insights.push({
      type: 'danger',
      text: 'Alto riesgo de sobreendeudamiento. Revisa gastos, crédito y deudas con prioridad.',
    })
  } else if (metrics.riskLevel === 'medio') {
    insights.push({
      type: 'warning',
      text: 'Riesgo financiero moderado: conviene reforzar ahorro y control de deuda.',
    })
  }

  if (summary.isOverBudget) {
    insights.push({
      type: 'danger',
      text: 'Superaste tu presupuesto mensual. Tus gastos superan los ingresos asignados.',
    })
  }

  if (debtToIncome > 50 && metrics.totalDebt > 0) {
    insights.push({
      type: 'warning',
      text: `Tu deuda total representa el ${Math.round(debtToIncome)}% de tus ingresos mensuales.`,
    })
  } else if (debtToIncome > 40 && metrics.totalDebt > 0) {
    insights.push({
      type: 'warning',
      text: `Tu deuda ya supera el 40% de tus ingresos (${Math.round(debtToIncome)}%).`,
    })
  }

  if (creditUsagePercent > 80) {
    insights.push({
      type: 'danger',
      text: `Uso de crédito muy alto (${Math.round(creditUsagePercent)}%). Riesgo de impago en tarjetas.`,
    })
  }

  const topCategory = categories[0]
  if (topCategory && topCategory.percent >= 45) {
    insights.push({
      type: 'info',
      text: `Concentración en "${topCategory.name}": ${topCategory.percent}% del gasto mensual.`,
    })
  }

  const priorityCard = cardStats.find((c) => c.stats.usagePercent >= 75)
  if (priorityCard) {
    insights.push({
      type: 'warning',
      text: `Prioriza el pago de la tarjeta ${priorityCard.card.name} (${Math.round(priorityCard.stats.usagePercent)}% de uso).`,
    })
  } else if (snowball.priority) {
    insights.push({
      type: 'info',
      text: `Prioriza la deuda "${snowball.priority.name}" con el método bola de nieve.`,
    })
  }

  if (summary.income > 0 && summary.savings > 0) {
    const rate = Math.round((summary.savings / summary.income) * 100)
    insights.push({
      type: 'success',
      text: `Ahorro mensual estimado: ${rate}% de tus ingresos.`,
    })
  } else if (summary.income > 0 && summary.savings <= 0 && summary.hasExpenses) {
    insights.push({
      type: 'warning',
      text: 'No te queda margen de ahorro este mes. Revisa gastos hormiga y categorías recurrentes.',
    })
  }

  if (insights.length === 0) {
    insights.push({
      type: 'info',
      text: 'Sin alertas críticas este mes. Mantén el seguimiento de gastos y metas.',
    })
  }

  return insights
}
