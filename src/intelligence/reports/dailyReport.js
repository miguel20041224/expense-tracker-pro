import {
  buildCategorySection,
  formatReportDate,
  formatReportMoney,
  percentChange,
  topExpensesToday,
} from './shared'
import {
  pickLocalizedTips,
  resolveReportLocale,
  translateHealthLevel,
} from '../../i18n/reportLocale'

export function buildDailyReport(context, analysis, options = {}) {
  const { locale, t } = resolveReportLocale(options)
  const { temporal, transactions, metrics } = context
  const { today, yesterday, todayExpenses, yesterdayExpenses } = temporal
  const change = percentChange(todayExpenses, yesterdayExpenses)
  const todayCategories = buildCategorySection(transactions, today, today, 3)
  const topToday = topExpensesToday(transactions, today, 5, t)

  const highlights = []
  if (todayExpenses > yesterdayExpenses && yesterdayExpenses > 0) {
    highlights.push(
      t('daily.highlights.spentMore', { percent: Math.round(change) }),
    )
  } else if (todayExpenses < yesterdayExpenses && yesterdayExpenses > 0) {
    highlights.push(
      t('daily.highlights.spentLess', { percent: Math.round(Math.abs(change)) }),
    )
  }
  if (todayExpenses === 0) {
    highlights.push(t('daily.highlights.noExpenses'))
  }

  const incomeUsedPercent = Math.round(
    (metrics.summary.expenses / Math.max(metrics.summary.income, 1)) * 100,
  )

  return {
    id: 'daily',
    title: t('daily.title'),
    subtitle: t('daily.subtitle'),
    periodLabel: formatReportDate(new Date(), locale),
    generatedAt: new Date().toISOString(),
    healthScore: analysis.health.score,
    healthLevel: analysis.health.level,
    healthLabel: translateHealthLevel(
      analysis.health.level,
      analysis.health.levelLabel,
      options.tDashboard,
    ),
    highlights,
    tips: pickLocalizedTips(analysis.insights, 3, options.localizeMessage),
    sections: [
      {
        id: 'summary',
        title: t('daily.sections.summary.title'),
        metrics: [
          {
            label: t('daily.sections.summary.metrics.todayExpenses'),
            value: todayExpenses,
            variant: 'expense',
          },
          {
            label: t('daily.sections.summary.metrics.yesterdayExpenses'),
            value: yesterdayExpenses,
            variant: 'neutral',
          },
          {
            label: t('daily.sections.summary.metrics.variation'),
            value: change,
            variant: change > 0 ? 'expense' : 'income',
            format: 'percent',
          },
          {
            label: t('daily.sections.summary.metrics.health'),
            value: analysis.health.score,
            variant: 'accent',
            format: 'score',
          },
        ],
      },
      {
        id: 'categories',
        title: t('daily.sections.categories.title'),
        categories: todayCategories,
        emptyMessage: t('daily.sections.categories.empty'),
      },
      {
        id: 'movements',
        title: t('daily.sections.movements.title'),
        items: topToday,
        emptyMessage: t('daily.sections.movements.empty'),
      },
      {
        id: 'context',
        title: t('daily.sections.context.title'),
        paragraphs: [
          metrics.summary.isOverBudget
            ? t('daily.sections.context.overBudget')
            : t('daily.sections.context.incomeUsed', { percent: incomeUsedPercent }),
        ],
      },
    ],
  }
}
