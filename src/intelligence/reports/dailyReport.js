import {
  buildCategorySection,
  formatReportDate,
  percentChange,
  pickTips,
  topExpensesToday,
} from './shared'

export function buildDailyReport(context, analysis) {
  const { temporal, transactions, metrics } = context
  const { today, yesterday, todayExpenses, yesterdayExpenses } = temporal
  const change = percentChange(todayExpenses, yesterdayExpenses)
  const todayCategories = buildCategorySection(transactions, today, today, 3)
  const topToday = topExpensesToday(transactions, today)

  const highlights = []
  if (todayExpenses > yesterdayExpenses && yesterdayExpenses > 0) {
    highlights.push(`Gastaste ${Math.round(change)}% más que ayer.`)
  } else if (todayExpenses < yesterdayExpenses && yesterdayExpenses > 0) {
    highlights.push(`Gastaste ${Math.round(Math.abs(change))}% menos que ayer.`)
  }
  if (todayExpenses === 0) {
    highlights.push('Sin gastos registrados hoy.')
  }

  return {
    id: 'daily',
    title: 'Reporte diario',
    subtitle: 'Resumen de tu día financiero',
    periodLabel: formatReportDate(new Date()),
    generatedAt: new Date().toISOString(),
    healthScore: analysis.health.score,
    healthLabel: analysis.health.levelLabel,
    highlights,
    tips: pickTips(analysis.insights, 3),
    sections: [
      {
        id: 'summary',
        title: 'Resumen del día',
        metrics: [
          { label: 'Gastos hoy', value: todayExpenses, variant: 'expense' },
          { label: 'Gastos ayer', value: yesterdayExpenses, variant: 'neutral' },
          {
            label: 'Variación',
            value: change,
            variant: change > 0 ? 'expense' : 'income',
            format: 'percent',
          },
          { label: 'Salud financiera', value: analysis.health.score, variant: 'accent', format: 'score' },
        ],
      },
      {
        id: 'categories',
        title: 'Categorías de hoy',
        categories: todayCategories,
        emptyMessage: 'No hay gastos categorizados hoy.',
      },
      {
        id: 'movements',
        title: 'Mayores gastos del día',
        items: topToday,
        emptyMessage: 'Sin movimientos hoy.',
      },
      {
        id: 'context',
        title: 'Contexto mensual',
        paragraphs: [
          metrics.summary.isOverBudget
            ? 'Vas sobre presupuesto este mes. Conviene frenar gastos discrecionales.'
            : `Llevas ${Math.round((metrics.summary.expenses / Math.max(metrics.summary.income, 1)) * 100)}% de tus ingresos usados en gastos este mes.`,
        ],
      },
    ],
  }
}
