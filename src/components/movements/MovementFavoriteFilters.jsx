import { FAVORITE_FILTER_OPTIONS } from '../../config/movementFilters'
import { FilterChip } from '../ui/FilterChip'
import { IconStar } from '../icons'
import { cn } from '../../utils/cn'

export function MovementFavoriteFilters({ value, onChange, favoriteCount = 0 }) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-0.5"
      role="group"
      aria-label="Filtro de favoritos"
    >
      {FAVORITE_FILTER_OPTIONS.map((option) => {
        const isFavorites = option.id === 'favorites'
        const active = value === option.id

        return (
          <FilterChip
            key={option.id}
            active={active}
            onClick={() => onChange(option.id)}
            className={cn(isFavorites && active && 'border-amber-500/35 bg-amber-500/15')}
          >
            {isFavorites ? (
              <span className="inline-flex items-center gap-1.5">
                <IconStar filled={active} className="size-3.5" />
                {option.label}
                {favoriteCount > 0 ? (
                  <span
                    className={cn(
                      'min-w-[1.125rem] rounded-full px-1 text-[10px] font-semibold tabular-nums',
                      active ? 'bg-amber-500/25 text-amber-100' : 'bg-white/8 text-slate-400',
                    )}
                  >
                    {favoriteCount}
                  </span>
                ) : null}
              </span>
            ) : (
              option.label
            )}
          </FilterChip>
        )
      })}
    </div>
  )
}
