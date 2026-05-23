import { useTranslation } from 'react-i18next'
import { Money } from '../currency/Money'
import { ProgressBar } from '../ui/ProgressBar'
import { Badge } from '../ui/Badge'
import { useCurrency } from '../../hooks/useCurrency'
import { cn } from '../../utils/cn'

export function CreditCardVisual({ card, stats, onDelete, selected, onSelect }) {
  const { t } = useTranslation('forms')
  const { formatCurrency } = useCurrency()
  const usageVariant =
    stats.usagePercent >= 90 ? 'expense' : stats.usagePercent >= 70 ? 'warning' : 'accent'

  return (
    <article
      className={cn(
        'relative overflow-hidden rounded-2xl border p-5 transition',
        selected
          ? 'border-accent/50 bg-linear-to-br from-accent/20 via-surface-card to-surface-card ring-1 ring-accent/30'
          : 'border-border-subtle bg-linear-to-br from-slate-800/80 via-surface-card to-surface-card hover:border-white/10',
      )}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-white/5 blur-2xl" />

      <button type="button" onClick={() => onSelect?.(card.id)} className="w-full text-left">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium tracking-widest text-slate-400 uppercase">
              {t('cards.visual.label')}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-white">{card.name}</h3>
          </div>
          {stats.isOverLimit ? <Badge variant="negative">{t('cards.visual.overLimit')}</Badge> : null}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-500">{t('cards.visual.used')}</p>
            <p className="text-lg font-semibold text-expense">
              <Money value={stats.usedBalance} />
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">{t('cards.visual.available')}</p>
            <p className="text-lg font-semibold text-income">
              <Money value={stats.available} />
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex justify-between text-xs">
            <span className="text-slate-500">{t('cards.visual.limitUsage')}</span>
            <span className="font-medium text-slate-300">{stats.usagePercent.toFixed(0)}%</span>
          </div>
          <ProgressBar value={stats.usagePercent} max={100} variant={usageVariant} />
          <p className="mt-1 text-xs text-slate-500">
            {t('cards.visual.limitSummary', {
              limit: formatCurrency(card.limit),
              count: stats.expenseCount,
            })}
          </p>
        </div>

        {card.benefits ? (
          <p className="mt-3 line-clamp-2 text-xs text-slate-400">{card.benefits}</p>
        ) : null}
      </button>

      {onDelete ? (
        <button
          type="button"
          onClick={() => onDelete(card.id)}
          className="mt-3 text-xs text-slate-500 transition hover:text-expense"
        >
          {t('cards.visual.delete')}
        </button>
      ) : null}
    </article>
  )
}
