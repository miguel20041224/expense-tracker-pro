/**
 * Insights predictivos a partir del outlook calculado (sin Firebase).
 * @param {import('./index').FinancialOutlook} outlook
 * @returns {import('../types').Insight[]}
 */
export function generatePredictiveInsights(outlook) {
  const insights = []
  const fmt = (n) =>
    Math.round(n).toLocaleString('es', { maximumFractionDigits: 0 })

  const { savings, debt, health, goals, expensePace, monthEnd, categoryProjections } =
    outlook

  if (savings?.twelveMonths?.total > 0) {
    insights.push({
      id: 'predict-savings-12m',
      type: 'success',
      priority: 20,
      category: 'predictive',
      text: `Si mantienes este ritmo, podrías acumular ~${fmt(savings.twelveMonths.total)} de margen en 12 meses.`,
    })
  }

  if (savings?.sixMonths?.total > 0 && savings.sixMonths.total !== savings.twelveMonths?.total) {
    insights.push({
      id: 'predict-savings-6m',
      type: 'info',
      priority: 28,
      category: 'predictive',
      text: `Proyección a 6 meses: ~${fmt(savings.sixMonths.total)} de ahorro acumulado al ritmo actual.`,
    })
  }

  if (debt?.hasDebt && debt.monthsToFree > 0) {
    insights.push({
      id: 'predict-debt-free',
      type: debt.monthsSaved > 0 ? 'success' : 'info',
      priority: 15,
      category: 'predictive',
      text:
        debt.monthsSaved > 0
          ? `Con tu pago extra, podrías liberarte de deudas en ~${debt.monthsToFree} meses (${debt.monthsSaved} meses antes que solo mínimos).`
          : `Al ritmo actual, terminarías tus deudas en aproximadamente ${debt.monthsToFree} meses.`,
    })
  }

  if (health?.direction === 'improving') {
    insights.push({
      id: 'predict-health-up',
      type: 'success',
      priority: 22,
      category: 'predictive',
      text: `Tu salud financiera podría mejorar hacia «${health.projectedLevelLabel}» (score ~${health.projectedScore}) en los próximos meses.`,
    })
  } else if (health?.direction === 'declining') {
    insights.push({
      id: 'predict-health-down',
      type: 'warning',
      priority: 10,
      category: 'predictive',
      text: `Si continúas así, tu salud financiera podría bajar a «${health.projectedLevelLabel}» (score ~${health.projectedScore}).`,
    })
  }

  if (expensePace?.overIncome) {
    insights.push({
      id: 'predict-expense-over',
      type: 'danger',
      priority: 8,
      category: 'predictive',
      text: `Al ritmo actual, cerrarías el mes con gastos proyectados de ~${fmt(expensePace.projected)} (superando tus ingresos).`,
    })
  } else if (monthEnd?.projected != null && monthEnd.projected > 0) {
    insights.push({
      id: 'predict-month-end',
      type: 'info',
      priority: 32,
      category: 'predictive',
      text: `Proyección fin de mes: ~${fmt(monthEnd.projected)} de margen si mantienes el ritmo (${monthEnd.daysRemaining} días restantes).`,
    })
  }

  const behindGoals = goals?.filter((g) => g.targetDateStatus === 'behind') ?? []
  if (behindGoals.length > 0) {
    insights.push({
      id: 'predict-goals-behind',
      type: 'warning',
      priority: 18,
      category: 'predictive',
      text: `La meta «${behindGoals[0].name}» podría no alcanzarse a tiempo al ritmo actual de ahorro.`,
    })
  }

  const onTrack = goals?.filter((g) => g.monthsToComplete != null && g.monthsToComplete > 0) ?? []
  if (onTrack.length > 0 && behindGoals.length === 0) {
    const g = onTrack[0]
    insights.push({
      id: 'predict-goal-eta',
      type: 'success',
      priority: 30,
      category: 'predictive',
      text: `Podrías completar «${g.name}» en ~${g.monthsToComplete} meses si mantienes tu ritmo de ahorro.`,
    })
  }

  for (const cat of categoryProjections ?? []) {
    if (cat.growthPercent >= 15 && cat.projectedNextMonth > 0) {
      insights.push({
        id: `predict-cat-${cat.name}`,
        type: 'warning',
        priority: 35,
        category: 'predictive',
        text: `Tu gasto en ${cat.name} podría crecer ~${Math.round(cat.growthPercent)}% el próximo mes si sigue la tendencia.`,
      })
      break
    }
  }

  if (outlook.budgetRunway?.exhausted) {
    insights.push({
      id: 'predict-runway',
      type: 'danger',
      priority: 6,
      category: 'predictive',
      text: 'Tu margen del mes podría agotarse antes de fin de mes al ritmo de gasto actual.',
    })
  }

  return insights
    .sort((a, b) => (a.priority ?? 50) - (b.priority ?? 50))
    .slice(0, 8)
}
