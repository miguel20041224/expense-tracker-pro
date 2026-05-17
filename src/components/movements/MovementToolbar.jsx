import { useState } from 'react'
import { MovementSearch } from './MovementSearch'
import { MovementQuickFilters } from './MovementQuickFilters'
import { MovementFavoriteFilters } from './MovementFavoriteFilters'
import { MovementFilterFields } from './MovementFilterFields'
import { Button } from '../ui/Button'
import { IconFilter } from '../icons'
import { cn } from '../../utils/cn'

export function MovementToolbar({
  filters,
  categories,
  hasActiveFilters,
  favoriteCount,
  onFilterChange,
  onReset,
}) {
  const [showAdvanced, setShowAdvanced] = useState(hasActiveFilters)

  return (
    <div className="space-y-4 border-b border-border-subtle pb-5">
      <MovementSearch
        value={filters.query}
        onChange={(value) => onFilterChange('query', value)}
      />

      <MovementQuickFilters
        value={filters.quickRange}
        onChange={(value) => onFilterChange('quickRange', value)}
      />

      <MovementFavoriteFilters
        value={filters.favoriteFilter}
        favoriteCount={favoriteCount}
        onChange={(value) => onFilterChange('favoriteFilter', value)}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setShowAdvanced((open) => !open)}
          className={cn(
            'inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium transition',
            showAdvanced
              ? 'border-accent/30 bg-accent/10 text-white'
              : 'border-border-subtle bg-white/3 text-slate-400 hover:bg-white/5 hover:text-slate-200',
          )}
          aria-expanded={showAdvanced}
        >
          <IconFilter className="size-4" />
          Filtros avanzados
        </button>

        {hasActiveFilters ? (
          <Button type="button" variant="secondary" size="sm" onClick={onReset}>
            Limpiar filtros
          </Button>
        ) : null}
      </div>

      {showAdvanced ? (
        <div className="motion-safe:animate-fade-in-up">
          <MovementFilterFields
            filters={filters}
            categories={categories}
            onFilterChange={onFilterChange}
          />
        </div>
      ) : null}
    </div>
  )
}
