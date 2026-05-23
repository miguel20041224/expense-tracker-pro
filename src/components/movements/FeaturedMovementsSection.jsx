import { useTranslation } from 'react-i18next'
import { IconStar } from '../icons'
import { MovementItem } from '../dashboard/MovementItem'
import { cn } from '../../utils/cn'

export function FeaturedMovementsSection({
  movements,
  favoriteCount,
  onToggleFavorite,
  onShowAllFavorites,
  onEdit,
  onDelete,
  className,
  creditCardNames,
}) {
  const { t } = useTranslation('forms')

  if (movements.length === 0) return null

  const hasMore = favoriteCount > movements.length

  return (
    <section
      className={cn(
        'mb-5 rounded-2xl border border-amber-500/15 bg-linear-to-br from-amber-500/8 via-transparent to-transparent p-4 motion-safe:animate-fade-in-up',
        className,
      )}
      aria-label={t('movements.featured.ariaLabel')}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex size-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400">
            <IconStar filled className="size-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">{t('movements.featured.title')}</h3>
            <p className="text-[11px] text-slate-500">
              {t('movements.featured.favoriteCount', { count: favoriteCount })}
            </p>
          </div>
        </div>

        {hasMore ? (
          <button
            type="button"
            onClick={onShowAllFavorites}
            className="text-xs font-medium text-amber-400/90 transition hover:text-amber-300"
          >
            {t('actions.viewAll')}
          </button>
        ) : null}
      </div>

      <ul className="divide-y divide-white/5">
        {movements.map((transaction) => (
          <MovementItem
            key={transaction.id}
            transaction={transaction}
            highlighted
            onToggleFavorite={onToggleFavorite}
            onEdit={onEdit}
            onDelete={onDelete}
            creditCardName={
              transaction.creditCardId
                ? creditCardNames?.get(transaction.creditCardId)
                : undefined
            }
          />
        ))}
      </ul>
    </section>
  )
}
