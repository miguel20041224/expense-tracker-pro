import { buildSnowballAnalysis } from '../../utils/debts'
import { buildMonthlyExpenseTrend } from '../trends'
import { formatReportMoney, percentChange, projectMonthEndSavings } from './shared'
import {
  localizeHealthRecommendation,
  pickLocalizedTips,
  resolveReportLocale,
  translateHealthLevel,
} from '../../i18n/reportLocale'

export function buildMonthlyReport(context, analysis, options = {}) {
  const { locale, t } = resolveReportLocale(options)
  const { metrics, goals, debts, transactions } = context
  const { summary, categories, debtToIncome } = metrics
  const now = new Date()
  const dayOfMonth = now.getDate()
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const monthLabel = now.toLocaleDateString(locale, { month: 'long', year: 'numeric' })

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

  const healthLevelLabel = translateHealthLevel(
    analysis.health.level,
    analysis.health.levelLabel,
    options.tDashboard,
  )

  const highlights = [
    t('monthly.highlights.incomeExpenses', {
      income: formatReportMoney(summary.income, locale),
      expenses: formatReportMoney(summary.expenses, locale),
    }),
    summary.isOverBudget
      ? t('monthly.highlights.deficitWarning')
      : t('monthly.highlights.savingsRate', { rate: savingsRate }),
    t('monthly.highlights.healthScore', {
      score: analysis.health.score,
      level: healthLevelLabel,
    }),
  ]

  const goalsSection = goals.map((g) => ({
    name: g.name,
    percent: g.targetAmount > 0 ? Math.round((g.currentAmount / g.targetAmount) * 100) : 0,
    current: g.currentAmount,
    target: g.targetAmount,
  }))

  const localizeHealth = (rec) =>
    localizeHealthRecommendation(rec, options.tDashboard)

  return {
    id: 'monthly',
    title: t('monthly.title'),
    subtitle: t('monthly.subtitle'),
    periodLabel: monthLabel,
    generatedAt: new Date().toISOString(),
    healthScore: analysis.health.score,
    healthLevel: analysis.health.level,
    healthLabel: healthLevelLabel,
    highlights,
    tips: [
      ...pickLocalizedTips(analysis.insights, 4, options.localizeMessage),
      ...analysis.health.recommendations.slice(0, 2).map(localizeHealth),
    ],
    trend,
    sections: [
      {
        id: 'summary',
        title: t('monthly.sections.summary.title'),
        metrics: [
          {
            label: t('monthly.sections.summary.metrics.income'),
            value: summary.income,
            variant: 'income',
          },
          {
            label: t('monthly.sections.summary.metrics.expenses'),
            value: summary.expenses,
            variant: 'expense',
          },
          {
            label: t('monthly.sections.summary.metrics.savings'),
            value: summary.savings,
            variant: summary.savings >= 0 ? 'income' : 'expense',
          },
          {
            label: t('monthly.sections.summary.metrics.health'),
            value: analysis.health.score,
            variant: 'accent',
            format: 'score',
          },
        ],
      },
      {
        id: 'evolution',
        title: t('monthly.sections.evolution.title'),
        paragraphs: [
          expenseMom !== 0
            ? expenseMom > 0
              ? t('monthly.sections.evolution.expensesUp', {
                  percent: Math.round(Math.abs(expenseMom)),
                })
              : t('monthly.sections.evolution.expensesDown', {
                  percent: Math.round(Math.abs(expenseMom)),
                })
            : t('monthly.sections.evolution.noComparison'),
          lastTrend
            ? t('monthly.sections.evolution.currentMonth', {
                income: formatReportMoney(lastTrend.income, locale),
                expenses: formatReportMoney(lastTrend.expenses, locale),
              })
            : '',
        ].filter(Boolean),
        trend,
      },
      {
        id: 'categories',
        title: t('monthly.sections.categories.title'),
        categories: categories.slice(0, 8),
        emptyMessage: t('monthly.sections.categories.empty'),
      },
      {
        id: 'habits',
        title: t('monthly.sections.habits.title'),
        bullets: buildMonthlyHabits(context, metrics, t),
      },
      {
        id: 'goals',
        title: t('monthly.sections.goals.title'),
        goals: goalsSection,
        emptyMessage: t('monthly.sections.goals.empty'),
      },
      {
        id: 'debts',
        title: t('monthly.sections.debts.title'),
        paragraphs: [
          debtToIncome > 0
            ? t('monthly.sections.debts.debtToIncome', {
                percent: Math.round(debtToIncome),
              })
            : t('monthly.sections.debts.noDebt'),
          snowball
            ? t('monthly.sections.debts.snowballPlan', { months: snowball.withExtra.months })
            : '',
          projection
            ? t('monthly.sections.debts.monthEndProjection', {
                projected: formatReportMoney(projection.projected, locale),
                daysRemaining: projection.daysRemaining,
              })
            : '',
        ].filter(Boolean),
      },
      {
        id: 'recommendations',
        title: t('monthly.sections.recommendations.title'),
        bullets: analysis.health.recommendations.map(localizeHealth),
      },
    ],
  }
}

function buildMonthlyHabits(context, metrics, t) {
  const bullets = []
  if (metrics.leisurePercent >= 40) {
    bullets.push(
      t('monthly.sections.habits.leisure', {
        percent: Math.round(metrics.leisurePercent),
      }),
    )
  }
  if (metrics.creditUsagePercent >= 60) {
    bullets.push(
      t('monthly.sections.habits.creditUsage', {
        percent: Math.round(metrics.creditUsagePercent),
      }),
    )
  }
  for (const g of context.categoryGrowth.slice(0, 2)) {
    bullets.push(
      t('monthly.sections.habits.categoryGrowth', {
        name: g.name,
        percent: Math.round(g.growthPercent),
      }),
    )
  }
  if (bullets.length === 0) {
    bullets.push(t('monthly.sections.habits.balanced'))
  }
  return bullets
}
