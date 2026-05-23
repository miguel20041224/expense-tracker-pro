import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
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
  creditCardNames,
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
  const { t } = useTranslation('forms')

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
          <CardTitle>{t('movements.panel.title')}</CardTitle>
          {!showNoData ? (
            <p className="mt-1 text-xs text-slate-500" aria-live="polite">
              {hasActiveFilters || filters.query.trim()
                ? t('movements.panel.resultsFiltered', { resultCount, totalCount })
                : t('movements.panel.totalOnly', { totalCount })}
              {favoriteCount > 0
                ? ` · ${t('movements.panel.favoritesSuffix', { count: favoriteCount })}`
                : ''}
            </p>
          ) : null}
        </div>
      </CardHeader>

      {showNoData ? (
        <EmptyState
          icon={<IconReceipt className="size-6" />}
          title={t('movements.empty.noDataTitle')}
          description={t('movements.empty.noDataDescription')}
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
              title={t('movements.empty.noResultsTitle')}
              description={t('movements.empty.noResultsDescription')}
            >
              <Button type="button" variant="secondary" size="sm" onClick={resetFilters}>
                {t('actions.resetFilters')}
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
                  creditCardNames={creditCardNames}
                />
              ) : null}

              {showTimeline ? (
                <MovementsTimeline
                  movements={timelineMovements}
                  className="mt-1"
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleFavorite={handleToggleFavorite}
                  creditCardNames={creditCardNames}
                />
              ) : showFeaturedSection ? (
                <p className="mt-2 text-center text-xs text-slate-500">
                  {t('movements.panel.allInFeatured')}
                </p>
              ) : null}
            </>
          )}
        </>
      )}
    </Card>
  )
}
