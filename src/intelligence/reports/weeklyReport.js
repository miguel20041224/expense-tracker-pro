import { buildSnowballAnalysis } from '../../utils/debts'
import {
  buildCategorySection,
  buildDailyExpenseSeries,
  countMovements,
  percentChange,
  pickTips,
  sumIncomeInRange,
} from './shared'
import { toDateKey } from '../rules/helpers'

export function buildWeeklyReport(context, analysis) {
  const { temporal, transactions, debts } = context
  const now = new Date()
  const today = temporal.today

  const last7Start = new Date(now)
  last7Start.setDate(last7Start.getDate() - 6)
  const fromKey = toDateKey(last7Start)

  const prev7End = new Date(last7Start)
  prev7End.setDate(prev7End.getDate() - 1)
  const prev7Start = new Date(prev7End)
  prev7Start.setDate(prev7Start.getDate() - 6)
  const prevFrom = toDateKey(prev7Start)
  const prevTo = toDateKey(prev7End)

  const weekExpenses = temporal.last7DaysExpenses
  const prevWeekExpenses = temporal.previous7DaysExpenses
  const weekIncome = sumIncomeInRange(transactions, fromKey, today)
  const weekChange = percentChange(weekExpenses, prevWeekExpenses)
  const categories = buildCategorySection(transactions, fromKey, today, 6)
  const dailySeries = buildDailyExpenseSeries(transactions, 7)
  const movementCount = countMovements(transactions, fromKey, today)

  const snowball = debts.length > 0 ? buildSnowballAnalysis(debts, 0) : null

  const highlights = [
    `Gastaste ${formatMoney(weekExpenses)} en los últimos 7 días.`,
    weekChange !== 0
      ? `${weekChange > 0 ? 'Subió' : 'Bajó'} ${Math.round(Math.abs(weekChange))}% vs la semana anterior.`
      : 'Gasto estable respecto a la semana anterior.',
  ]

  if (analysis.health.score >= 70) {
    highlights.push(`Salud financiera en nivel ${analysis.health.levelLabel.toLowerCase()}.`)
  }

  return {
    id: 'weekly',
    title: 'Reporte semanal',
    subtitle: 'Últimos 7 días · hábitos y ritmo de gasto',
    periodLabel: `${formatShort(fromKey)} – ${formatShort(today)}`,
    generatedAt: new Date().toISOString(),
    healthScore: analysis.health.score,
    healthLabel: analysis.health.levelLabel,
    highlights,
    tips: pickTips(analysis.insights, 5),
    dailySeries,
    sections: [
      {
        id: 'summary',
        title: 'Resumen semanal',
        metrics: [
          { label: 'Gastos 7 días', value: weekExpenses, variant: 'expense' },
          { label: 'Ingresos 7 días', value: weekIncome, variant: 'income' },
          {
            label: 'vs semana anterior',
            value: weekChange,
            variant: weekChange > 0 ? 'expense' : 'income',
            format: 'percent',
          },
          { label: 'Movimientos', value: movementCount, variant: 'neutral', format: 'number' },
        ],
      },
      {
        id: 'categories',
        title: 'Categorías de la semana',
        categories,
        emptyMessage: 'Sin gastos esta semana.',
      },
      {
        id: 'habits',
        title: 'Hábitos detectados',
        bullets: buildHabitBullets(context, weekExpenses, prevWeekExpenses),
      },
      {
        id: 'debts',
        title: 'Deudas',
        paragraphs: snowball
          ? [
              `Saldo total: ${formatMoney(snowball.totalBalance)}. Libre en ~${snowball.withExtra.months} meses (solo mínimos).`,
              snowball.priority
                ? `Prioridad bola de nieve: ${snowball.priority.name}.`
                : '',
            ].filter(Boolean)
          : ['Sin deudas registradas.'],
      },
      {
        id: 'projection',
        title: 'Proyección',
        paragraphs: [
          weekIncome > weekExpenses
            ? `Ritmo semanal positivo: ahorro estimado de ${formatMoney(weekIncome - weekExpenses)} en el período.`
            : 'El ritmo semanal consume más de lo que ingresas en el período. Ajusta gastos o revisa presupuesto.',
        ],
      },
    ],
  }
}

function buildHabitBullets(context, weekExp, prevWeek) {
  const bullets = []
  const top = context.categoryGrowth[0]
  if (top) {
    bullets.push(`"${top.name}" creció ${Math.round(top.growthPercent)}% vs el mes pasado.`)
  }
  if (context.microSpends.count >= 4) {
    bullets.push(
      `${context.microSpends.count} gastos hormiga (${Math.round(context.microSpends.sharePercent)}% del mes).`,
    )
  }
  if (weekExp > prevWeek * 1.1) {
    bullets.push('Tendencia al alza en gastos semanales.')
  } else if (weekExp < prevWeek * 0.9 && prevWeek > 0) {
    bullets.push('Mejor control de gastos vs la semana pasada.')
  }
  if (bullets.length === 0) {
    bullets.push('Sin cambios de hábito significativos esta semana.')
  }
  return bullets
}

function formatMoney(n) {
  return new Intl.NumberFormat('es', { maximumFractionDigits: 0 }).format(n)
}

function formatShort(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('es', { day: 'numeric', month: 'short' })
}
