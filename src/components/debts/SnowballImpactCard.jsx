import { useTranslation } from 'react-i18next'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { Money } from '../currency/Money'
import { useCurrency } from '../../hooks/useCurrency'
import { cn } from '../../utils/cn'

export function SnowballImpactCard({ analysis, extraAmount }) {
  const { t, i18n } = useTranslation('forms')
  const { formatCurrency } = useCurrency()
  const { impact, comparison, payoffDate } = analysis
  const hasExtra = extraAmount > 0

  if (!hasExtra && impact.baselineMonths === 0) return null

  const strategyKey =
    comparison.fasterStrategy === 'avalanche' ? 'debts.impact.avalanche' : 'debts.impact.snowball'

  return (
    <Card className="border-emerald-500/20 bg-linear-to-br from-emerald-500/8 to-transparent">
      <CardHeader>
        <CardTitle>{t('debts.impact.title')}</CardTitle>
        {hasExtra ? (
          <span className="text-xs text-emerald-400">
            {t('debts.impact.perMonth', { amount: formatCurrency(extraAmount) })}
          </span>
        ) : (
          <span className="text-xs text-slate-500">{t('debts.impact.noExtraSimulated')}</span>
        )}
      </CardHeader>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ImpactStat
          label={t('debts.impact.withoutExtra')}
          value={t('debts.summary.monthsCount', { count: impact.baselineMonths })}
          sub={t('debts.impact.minimumOnly')}
        />
        <ImpactStat
          label={t('debts.impact.withYourExtra')}
          value={t('debts.summary.monthsCount', { count: impact.extraMonths })}
          sub={payoffDate ? t('debts.impact.freeAround', { date: formatDate(payoffDate, i18n.language) }) : undefined}
          highlight
        />
        <ImpactStat
          label={t('debts.impact.monthsSaved')}
          value={impact.monthsSaved > 0 ? `${impact.monthsSaved}` : '—'}
          sub={
            impact.monthsSaved > 0 ? t('debts.impact.vsMinimumOnly') : t('debts.impact.tryHigherAmount')
          }
          positive={impact.monthsSaved > 0}
        />
        <ImpactStat
          label={t('debts.impact.estimatedInterest')}
          value={
            impact.interestSaved > 0 ? (
              <Money value={impact.interestSaved} />
            ) : (
              '—'
            )
          }
          sub={t('debts.impact.lessInterestPaid')}
          positive={impact.interestSaved > 0}
        />
      </dl>

      {comparison.fasterStrategy !== 'tie' ? (
        <p className="mt-4 rounded-xl border border-white/6 bg-white/3 px-3 py-2 text-xs text-slate-400">
          {t('debts.impact.strategyComparison', {
            strategy: t(strategyKey),
            months:
              comparison.fasterStrategy === 'avalanche'
                ? comparison.avalancheMonths
                : comparison.snowballMonths,
            otherMonths:
              comparison.fasterStrategy === 'avalanche'
                ? comparison.snowballMonths
                : comparison.avalancheMonths,
          })}
        </p>
      ) : null}
    </Card>
  )
}

function ImpactStat({ label, value, sub, highlight, positive }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd
        className={cn(
          'mt-0.5 text-lg font-semibold tabular-nums',
          highlight ? 'text-income' : positive ? 'text-emerald-400' : 'text-white',
        )}
      >
        {value}
      </dd>
      {sub ? <p className="mt-0.5 text-xs text-slate-500">{sub}</p> : null}
    </div>
  )
}

function formatDate(iso, locale) {
  return new Date(iso).toLocaleDateString(locale, { month: 'short', year: 'numeric' })
}
