import { useTranslation } from 'react-i18next'
import { useCurrency } from '../../hooks/useCurrency'
import { Money } from '../currency/Money'
import { EmptyState } from '../ui/EmptyState'
import { IconWallet } from '../icons'
import { cn } from '../../utils/cn'

export function BalanceHero({ summary }) {
  const { t } = useTranslation('dashboard')
  const { formatCurrency } = useCurrency()
  const { balance, budgets, expenses, hasActivity, isOverBudget } = summary

  if (!hasActivity) {
    return (
      <article className="relative overflow-hidden rounded-3xl border border-border-subtle bg-linear-to-br from-slate-900 via-surface-card to-accent-muted/30 p-6 sm:p-8">
        <span
          className="pointer-events-none absolute -top-10 -right-10 block h-40 w-40 rounded-full bg-accent/10 blur-2xl"
          aria-hidden
        />
        <EmptyState
          className="relative py-6 sm:py-8"
          icon={<IconWallet className="size-6" />}
          title={t('metrics.balance.heroEmptyTitle')}
          description={t('metrics.balance.heroEmptyDescription')}
        />
      </article>
    )
  }

  return (
    <article className="relative overflow-hidden rounded-3xl border border-border-subtle bg-linear-to-br from-slate-900 via-surface-card to-accent-muted/40 p-6 sm:p-8">
      <span
        className="pointer-events-none absolute -top-10 -right-10 block h-40 w-40 rounded-full bg-accent/20 blur-2xl"
        aria-hidden
      />

      <div className="relative">
        <p className="text-sm font-medium text-slate-400">{t('metrics.balance.availableLabel')}</p>
        <p
          className={cn(
            'mt-2 text-4xl font-semibold tracking-tight sm:text-5xl',
            isOverBudget ? 'text-expense' : 'text-white',
          )}
        >
          <Money value={balance} />
        </p>
        <p className="mt-4 text-sm text-slate-500">
          {t('metrics.balance.breakdown', {
            budgets: formatCurrency(budgets),
            expenses: formatCurrency(expenses),
          })}
        </p>
      </div>
    </article>
  )
}
