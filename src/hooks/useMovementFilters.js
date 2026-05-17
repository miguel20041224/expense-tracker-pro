import { useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react'
import {
  DEFAULT_MOVEMENT_FILTERS,
  MOVEMENT_FILTERS_STORAGE_KEY,
} from '../config/movementFilters'
import {
  filterAndSortMovements,
  getAvailableCategories,
  hasActiveMovementFilters,
} from '../utils/movementFilters'

function readStoredFilters() {
  try {
    const raw = localStorage.getItem(MOVEMENT_FILTERS_STORAGE_KEY)
    if (!raw) return DEFAULT_MOVEMENT_FILTERS
    const parsed = JSON.parse(raw)
    return { ...DEFAULT_MOVEMENT_FILTERS, ...parsed }
  } catch {
    return DEFAULT_MOVEMENT_FILTERS
  }
}

export function useMovementFilters(transactions) {
  const [filters, setFilters] = useState(readStoredFilters)
  const deferredQuery = useDeferredValue(filters.query)

  useEffect(() => {
    localStorage.setItem(MOVEMENT_FILTERS_STORAGE_KEY, JSON.stringify(filters))
  }, [filters])

  const categories = useMemo(
    () => getAvailableCategories(transactions),
    [transactions],
  )

  const filtersForQuery = useMemo(
    () => ({ ...filters, query: deferredQuery }),
    [filters, deferredQuery],
  )

  const filteredMovements = useMemo(
    () => filterAndSortMovements(transactions, filtersForQuery),
    [transactions, filtersForQuery],
  )

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value }

      if (key === 'date' && value) {
        next.quickRange = 'all'
      }

      if (key === 'quickRange' && value !== 'all') {
        next.date = ''
      }

      return next
    })
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_MOVEMENT_FILTERS)
  }, [])

  const hasActiveFilters = useMemo(() => hasActiveMovementFilters(filters), [filters])

  return {
    filters,
    filteredMovements,
    categories,
    updateFilter,
    resetFilters,
    hasActiveFilters,
    totalCount: transactions.length,
    resultCount: filteredMovements.length,
  }
}
