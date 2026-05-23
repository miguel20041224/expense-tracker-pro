import { useTranslation } from 'react-i18next'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { useCurrency } from '../../hooks/useCurrency'
import { cn } from '../../utils/cn'

export function SnowballTimeline({ ordered, steps, totalMonths }) {
  const { t } = useTranslation('forms')
  const { formatCurrency } = useCurrency()

  if (!ordered?.length) return null

  const maxMonth = Math.max(totalMonths, 1)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('debts.timeline.title')}</CardTitle>
        <span className="text-xs text-slate-500">{t('debts.timeline.subtitle')}</span>
      </CardHeader>

      <div className="relative space-y-4 pl-2">
        <div
          className="absolute top-2 bottom-2 left-[15px] w-px bg-white/10"
          aria-hidden
        />

        {ordered.map((debt, index) => {
          const payoff = steps.find((s) => s.debtId === debt.id)
          const month = payoff?.paidOffMonth ?? null
          const progress = month ? Math.min((month / maxMonth) * 100, 100) : 8

          return (
            <div key={debt.id} className="relative flex gap-4">
              <span
                className={cn(
                  'relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                  month ? 'bg-income text-surface' : 'bg-white/10 text-slate-500',
                )}
              >
                {index + 1}
              </span>

              <div className="min-w-0 flex-1 pb-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-medium text-white">{debt.name}</p>
                  {month ? (
                    <p className="text-xs font-medium text-income">
                      {t('debts.timeline.month', { month })}
                      {month === maxMonth ? t('debts.timeline.debtFree') : ''}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-500">{t('debts.timeline.waiting')}</p>
                  )}
                </div>

                <p className="mt-0.5 text-xs text-slate-500">
                  {t('debts.timeline.balance', { amount: formatCurrency(debt.balance) })}
                </p>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                  <span
                    className={cn(
                      'block h-full rounded-full transition-all duration-700',
                      month ? 'bg-income' : 'bg-slate-600',
                    )}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
