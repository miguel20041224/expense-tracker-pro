import { Card, CardHeader, CardTitle } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'
import { Button } from '../ui/Button'
import { IconReceipt, IconSearch } from '../icons'
import { MovementToolbar } from '../movements/MovementToolbar'
import { MovementsTimeline } from '../movements/MovementsTimeline'
import { useMovementFilters } from '../../hooks/useMovementFilters'

export function MovementsPanel({ transactions, isEmpty }) {
  const {
    filters,
    filteredMovements,
    categories,
    updateFilter,
    resetFilters,
    hasActiveFilters,
    totalCount,
    resultCount,
  } = useMovementFilters(transactions)

  const showNoData = isEmpty
  const showNoResults = !isEmpty && resultCount === 0

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
            <MovementsTimeline movements={filteredMovements} className="mt-1" />
          )}
        </>
      )}
    </Card>
  )
}
