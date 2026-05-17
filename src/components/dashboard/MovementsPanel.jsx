import { useCallback } from 'react'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'
import { Button } from '../ui/Button'
import { IconReceipt, IconSearch } from '../icons'
import { MovementToolbar } from '../movements/MovementToolbar'
import { MovementsTimeline } from '../movements/MovementsTimeline'
import { FeaturedMovementsSection } from '../movements/FeaturedMovementsSection'
import { useMovementFilters } from '../../hooks/useMovementFilters'

export function MovementsPanel({
  transactions,
  isEmpty,
  onEdit,
  onDelete,
  onToggleFavorite,
}) {
  const {
    filters,
    filteredMovements,
    timelineMovements,
    featuredMovements,
    showFeaturedSection,
    favoriteCount,
    categories,
    updateFilter,
    resetFilters,
    hasActiveFilters,
    totalCount,
    resultCount,
  } = useMovementFilters(transactions)

  const showNoData = isEmpty
  const showNoResults = !isEmpty && resultCount === 0
  const showTimeline = !showNoResults && timelineMovements.length > 0

  const handleShowAllFavorites = useCallback(() => {
    updateFilter('favoriteFilter', 'favorites')
  }, [updateFilter])

  const handleToggleFavorite = useCallback(
    (transaction) => {
      onToggleFavorite?.(transaction.id)
    },
    [onToggleFavorite],
  )

  return (
    <Card className="flex flex-col motion-safe:animate-fade-in-up">
      <CardHeader className="flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <CardTitle>Historial de movimientos</CardTitle>
          {!showNoData ? (
            <p className="mt-1 text-xs text-slate-500" aria-live="polite">
              {hasActiveFilters || filters.query.trim()
                ? `${resultCount} de ${totalCount} resultados`
                : `${totalCount} en total`}
              {favoriteCount > 0 ? ` · ${favoriteCount} favoritos` : ''}
            </p>
          ) : null}
        </div>
      </CardHeader>

      {showNoData ? (
        <EmptyState
          icon={<IconReceipt className="size-6" />}
          title="Sin movimientos registrados"
          description="Agrega un presupuesto en la pestaña Presupuesto o un gasto en Resumen para ver tu historial aquí."
        />
      ) : (
        <>
          <MovementToolbar
            filters={filters}
            categories={categories}
            hasActiveFilters={hasActiveFilters}
            favoriteCount={favoriteCount}
            onFilterChange={updateFilter}
            onReset={resetFilters}
          />

          {showNoResults ? (
            <EmptyState
              className="mt-2"
              icon={<IconSearch className="size-5" />}
              title="No hay resultados"
              description="Prueba con otros términos de búsqueda o ajusta los filtros para ver más movimientos."
            >
              <Button type="button" variant="secondary" size="sm" onClick={resetFilters}>
                Restablecer filtros
              </Button>
            </EmptyState>
          ) : (
            <>
              {showFeaturedSection ? (
                <FeaturedMovementsSection
                  className="mt-1"
                  movements={featuredMovements}
                  favoriteCount={favoriteCount}
                  onToggleFavorite={handleToggleFavorite}
                  onShowAllFavorites={handleShowAllFavorites}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ) : null}

              {showTimeline ? (
                <MovementsTimeline
                  movements={timelineMovements}
                  className="mt-1"
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleFavorite={handleToggleFavorite}
                />
              ) : showFeaturedSection ? (
                <p className="mt-2 text-center text-xs text-slate-500">
                  Todos tus movimientos visibles están en destacados.
                </p>
              ) : null}
            </>
          )}
        </>
      )}
    </Card>
  )
}
