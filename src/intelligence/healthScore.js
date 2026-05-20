const LEVELS = [
  { min: 80, id: 'saludable', label: 'Saludable', color: 'emerald' },
  { min: 60, id: 'estable', label: 'Estable', color: 'sky' },
  { min: 40, id: 'en-riesgo', label: 'En riesgo', color: 'amber' },
  { min: 0, id: 'critico', label: 'Crítico', color: 'rose' },
]

/**
 * Convierte métricas de riesgo (0–100, mayor = peor) en salud financiera (0–100, mayor = mejor).
 */
export function computeFinancialHealthScore(metrics) {
  const risk = Math.min(100, Math.max(0, metrics.riskScore ?? 0))
  const score = Math.round(100 - risk)

  const level = LEVELS.find((l) => score >= l.min) ?? LEVELS[LEVELS.length - 1]

  const recommendations = []
  const { summary, debtToIncome, creditUsagePercent, leisurePercent, snowball } = metrics

  if (summary.isOverBudget) {
    recommendations.push('Reduce gastos o ajusta tu presupuesto para cerrar el mes en positivo.')
  }
  if (debtToIncome > 40) {
    recommendations.push('Prioriza pagos de deuda; tu carga supera el 40% de tus ingresos.')
  }
  if (creditUsagePercent > 70) {
    recommendations.push('Baja el uso de tarjetas de crédito por debajo del 70%.')
  }
  if (leisurePercent > 40 && summary.expenses > 0) {
    recommendations.push('Revisa gastos de ocio y entretenimiento; representan gran parte del mes.')
  }
  if (snowball.priority && metrics.totalDebt > 0) {
    recommendations.push(
      `Destina pagos extra a "${snowball.priority.name}" (método bola de nieve).`,
    )
  }
  if (summary.income > 0 && summary.savings > 0 && score >= 60) {
    recommendations.push('Mantén el ritmo de ahorro y revisa tus metas cada semana.')
  }
  if (recommendations.length === 0) {
    recommendations.push('Registra movimientos con frecuencia para un análisis más preciso.')
  }

  return {
    score,
    level: level.id,
    levelLabel: level.label,
    levelColor: level.color,
    riskLevel: metrics.riskLevel,
    recommendations: recommendations.slice(0, 4),
  }
}
