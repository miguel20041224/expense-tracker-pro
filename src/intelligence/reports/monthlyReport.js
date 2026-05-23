import { buildSnowballAnalysis } from '../../utils/debts'
import { buildMonthlyExpenseTrend } from '../trends'
import { percentChange, pickTips, projectMonthEndSavings } from './shared'

export function buildMonthlyReport(context, analysis) {
  const { metrics, goals, debts, transactions } = context
  const { summary, categories, debtToIncome } = metrics
  const now = new Date()
  const dayOfMonth = now.getDate()
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const monthLabel = now.toLocaleDateString('es', { month: 'long', year: 'numeric' })

  const trend = analysis.trend ?? buildMonthlyExpenseTrend(transactions, 6)
  const lastTrend = trend[trend.length - 1]
  const prevTrend = trend[trend.length - 2]
  const expenseMom =
    prevTrend?.expenses > 0
      ? percentChange(lastTrend?.expenses ?? 0, prevTrend.expenses)
      : 0

  const projection = projectMonthEndSavings(summary, dayOfMonth, daysInMonth)
  const snowball = debts.length > 0 ? buildSnowballAnalysis(debts, 0) : null

  const savingsRate =
    summary.income > 0 ? Math.round((Math.max(summary.savings, 0) / summary.income) * 100) : 0

  const highlights = [
    `Ingresos del mes: ${formatMoney(summary.income)} · Gastos: ${formatMoney(summary.expenses)}.`,
    summary.isOverBudget
      ? 'Cerrarás en déficit si mantienes el ritmo actual.'
      : `Ahorro disponible: ${savingsRate}% de tus ingresos.`,
    `Puntuación de salud: ${analysis.health.score}/100 (${analysis.health.levelLabel}).`,
  ]

  const goalsSection = goals.map((g) => ({
    name: g.name,
    percent: g.targetAmount > 0 ? Math.round((g.currentAmount / g.targetAmount) * 100) : 0,
    current: g.currentAmount,
    target: g.targetAmount,
  }))

  return {
    id: 'monthly',
    title: 'Reporte mensual',
    subtitle: 'Análisis profesional · evolución y proyecciones',
    periodLabel: monthLabel,
    generatedAt: new Date().toISOString(),
    healthScore: analysis.health.score,
    healthLabel: analysis.health.levelLabel,
    highlights,
    tips: [
      ...pickTips(analysis.insights, 4),
      ...analysis.health.recommendations.slice(0, 2).map((r) => (typeof r === 'string' ? r : r.text)),
    ],
    trend,
    sections: [
      {
        id: 'summary',
        title: 'Resumen financiero',
        metrics: [
          { label: 'Ingresos', value: summary.income, variant: 'income' },
          { label: 'Gastos', value: summary.expenses, variant: 'expense' },
          { label: 'Ahorro', value: summary.savings, variant: summary.savings >= 0 ? 'income' : 'expense' },
          { label: 'Salud', value: analysis.health.score, variant: 'accent', format: 'score' },
        ],
      },
      {
        id: 'evolution',
        title: 'Evolución',
        paragraphs: [
          expenseMom !== 0
            ? `Gastos ${expenseMom > 0 ? 'subieron' : 'bajaron'} ${Math.round(Math.abs(expenseMom))}% respecto al mes anterior (serie histórica).`
            : 'Sin datos suficientes del mes anterior para comparar evolución.',
          lastTrend
            ? `Mes actual en curso: ingresos ${formatMoney(lastTrend.income)}, gastos ${formatMoney(lastTrend.expenses)}.`
            : '',
        ].filter(Boolean),
        trend,
      },
      {
        id: 'categories',
        title: 'Distribución por categoría',
        categories: categories.slice(0, 8),
        emptyMessage: 'Sin gastos categorizados este mes.',
      },
      {
        id: 'habits',
        title: 'Hábitos y riesgos',
        bullets: buildMonthlyHabits(context, metrics),
      },
      {
        id: 'goals',
        title: 'Metas financieras',
        goals: goalsSection,
        emptyMessage: 'No tienes metas activas.',
      },
      {
        id: 'debts',
        title: 'Deudas y proyección',
        paragraphs: [
          debtToIncome > 0
            ? `Deuda total representa el ${Math.round(debtToIncome)}% de tus ingresos mensuales.`
            : 'Sin deuda registrada.',
          snowball
            ? `Plan bola de nieve: libre en ${snowball.withExtra.months} meses pagando mínimos.`
            : '',
          projection
            ? `Proyección fin de mes: ~${formatMoney(projection.projected)} de margen si mantienes el ritmo (${projection.daysRemaining} días restantes).`
            : '',
        ].filter(Boolean),
      },
      {
        id: 'recommendations',
        title: 'Consejos automáticos',
        bullets: analysis.health.recommendations.map((r) =>
          typeof r === 'string' ? r : r.text,
        ),
      },
    ],
  }
}

function buildMonthlyHabits(context, metrics) {
  const bullets = []
  if (metrics.leisurePercent >= 40) {
    bullets.push(`Ocio/entretenimiento: ${Math.round(metrics.leisurePercent)}% del gasto mensual.`)
  }
  if (metrics.creditUsagePercent >= 60) {
    bullets.push(`Uso de crédito agregado: ${Math.round(metrics.creditUsagePercent)}%.`)
  }
  for (const g of context.categoryGrowth.slice(0, 2)) {
    bullets.push(`"${g.name}" +${Math.round(g.growthPercent)}% vs mes anterior.`)
  }
  if (bullets.length === 0) {
    bullets.push('Patrones de gasto equilibrados este mes.')
  }
  return bullets
}

function formatMoney(n) {
  return new Intl.NumberFormat('es', { maximumFractionDigits: 0 }).format(n)
}
