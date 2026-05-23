import { buildSnowballAnalysis } from '../../utils/debts'
import {
  buildCategorySection,
  buildDailyExpenseSeries,
  countMovements,
  formatReportMoney,
  formatShortDate,
  percentChange,
  sumIncomeInRange,
} from './shared'
import { toDateKey } from '../rules/helpers'
import {
  pickLocalizedTips,
  resolveReportLocale,
  translateHealthLevel,
} from '../../i18n/reportLocale'

export function buildWeeklyReport(context, analysis, options = {}) {
  const { locale, t } = resolveReportLocale(options)
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
  const dailySeries = buildDailyExpenseSeries(transactions, 7, locale)
  const movementCount = countMovements(transactions, fromKey, today)

  const snowball = debts.length > 0 ? buildSnowballAnalysis(debts, 0) : null
  const healthLevelLabel = translateHealthLevel(
    analysis.health.level,
    analysis.health.levelLabel,
    options.tDashboard,
  )

  const highlights = [
    t('weekly.highlights.spentInPeriod', {
      amount: formatReportMoney(weekExpenses, locale),
    }),
    weekChange !== 0
      ? weekChange > 0
        ? t('weekly.highlights.increased', { percent: Math.round(Math.abs(weekChange)) })
        : t('weekly.highlights.decreased', { percent: Math.round(Math.abs(weekChange)) })
      : t('weekly.highlights.stable'),
  ]

  if (analysis.health.score >= 70) {
    highlights.push(
      t('weekly.highlights.healthLevel', { level: healthLevelLabel.toLowerCase() }),
    )
  }

  return {
    id: 'weekly',
    title: t('weekly.title'),
    subtitle: t('weekly.subtitle'),
    periodLabel: `${formatShortDate(fromKey, locale)} – ${formatShortDate(today, locale)}`,
    generatedAt: new Date().toISOString(),
    healthScore: analysis.health.score,
    healthLevel: analysis.health.level,
    healthLabel: healthLevelLabel,
    highlights,
    tips: pickLocalizedTips(analysis.insights, 5, options.localizeMessage),
    dailySeries,
    sections: [
      {
        id: 'summary',
        title: t('weekly.sections.summary.title'),
        metrics: [
          {
            label: t('weekly.sections.summary.metrics.weekExpenses'),
            value: weekExpenses,
            variant: 'expense',
          },
          {
            label: t('weekly.sections.summary.metrics.weekIncome'),
            value: weekIncome,
            variant: 'income',
          },
          {
            label: t('weekly.sections.summary.metrics.vsPreviousWeek'),
            value: weekChange,
            variant: weekChange > 0 ? 'expense' : 'income',
            format: 'percent',
          },
          {
            label: t('weekly.sections.summary.metrics.movements'),
            value: movementCount,
            variant: 'neutral',
            format: 'number',
          },
        ],
      },
      {
        id: 'categories',
        title: t('weekly.sections.categories.title'),
        categories,
        emptyMessage: t('weekly.sections.categories.empty'),
      },
      {
        id: 'habits',
        title: t('weekly.sections.habits.title'),
        bullets: buildHabitBullets(context, weekExpenses, prevWeekExpenses, t),
      },
      {
        id: 'debts',
        title: t('weekly.sections.debts.title'),
        paragraphs: snowball
          ? [
              t('weekly.sections.debts.totalBalance', {
                amount: formatReportMoney(snowball.totalBalance, locale),
                months: snowball.withExtra.months,
              }),
              snowball.priority
                ? t('weekly.sections.debts.snowballPriority', { name: snowball.priority.name })
                : '',
            ].filter(Boolean)
          : [t('weekly.sections.debts.noDebts')],
      },
      {
        id: 'projection',
        title: t('weekly.sections.projection.title'),
        paragraphs: [
          weekIncome > weekExpenses
            ? t('weekly.sections.projection.positivePace', {
                amount: formatReportMoney(weekIncome - weekExpenses, locale),
              })
            : t('weekly.sections.projection.negativePace'),
        ],
      },
    ],
  }
}

function buildHabitBullets(context, weekExp, prevWeek, t) {
  const bullets = []
  const top = context.categoryGrowth[0]
  if (top) {
    bullets.push(
      t('weekly.sections.habits.categoryGrowth', {
        name: top.name,
        percent: Math.round(top.growthPercent),
      }),
    )
  }
  if (context.microSpends.count >= 4) {
    bullets.push(
      t('weekly.sections.habits.microSpends', {
        count: context.microSpends.count,
        sharePercent: Math.round(context.microSpends.sharePercent),
      }),
    )
  }
  if (weekExp > prevWeek * 1.1) {
    bullets.push(t('weekly.sections.habits.spendingUp'))
  } else if (weekExp < prevWeek * 0.9 && prevWeek > 0) {
    bullets.push(t('weekly.sections.habits.spendingDown'))
  }
  if (bullets.length === 0) {
    bullets.push(t('weekly.sections.habits.noChanges'))
  }
  return bullets
}
