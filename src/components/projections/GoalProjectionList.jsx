import { useTranslation } from 'react-i18next'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'
import { ProgressBar } from '../ui/ProgressBar'
import { IconPiggyBank } from '../icons'
import { cn } from '../../utils/cn'
import { useCurrency } from '../../hooks/useCurrency'

export function GoalProjectionList({ goals }) {
  const { t } = useTranslation('projections')
  const { formatCurrency } = useCurrency()
  const active = goals?.filter((g) => !g.isComplete) ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('goals.title')}</CardTitle>
        <span className="text-xs text-slate-500">{t('goals.subtitle')}</span>
      </CardHeader>

      {active.length === 0 ? (
        <EmptyState
          icon={<IconPiggyBank className="size-6" />}
          title={t('goals.emptyTitle')}
          description={t('goals.emptyDescription')}
        />
      ) : (
        <ul className="space-y-4">
          {active.map((goal) => (
            <li key={goal.id} className="rounded-xl border border-border-subtle bg-white/3 p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-slate-200">{goal.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {t('goals.remaining', { amount: formatCurrency(goal.remaining) })}
                  </p>
                </div>
                {goal.monthsToComplete != null ? (
                  <span
                    className={cn(
                      'rounded-md px-2 py-0.5 text-xs font-medium',
                      goal.targetDateStatus === 'behind'
                        ? 'bg-rose-500/15 text-rose-300'
                        : 'bg-emerald-500/15 text-emerald-300',
                    )}
                  >
                    {t('goals.monthsEta', { count: goal.monthsToComplete })}
                    {goal.etaLabel ? ` · ${goal.etaLabel}` : ''}
                  </span>
                ) : (
                  <span className="text-xs text-slate-500">{t('goals.noSavingsPace')}</span>
                )}
              </div>
              <ProgressBar value={goal.percent} className="mt-3" />
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
