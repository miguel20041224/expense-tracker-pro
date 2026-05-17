import { DEFAULT_MOVEMENT_FILTERS } from '../config/movementFilters'
import { getMovementTimestamp } from './movements'
import { isMovementFavorite } from './movementFlags'

function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function endOfDay(date) {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

function startOfWeek(date) {
  const d = startOfDay(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d
}

function endOfWeek(date) {
  const start = startOfWeek(date)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  return endOfDay(end)
}

export function getMovementDate(transaction) {
  const source = transaction.createdAt ?? transaction.date
  if (!source) return null
  const parsed = new Date(source.includes('T') ? source : `${source}T12:00:00`)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export function getSearchableText(transaction) {
  return [transaction.label, transaction.category, transaction.description]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

export function matchesSearch(transaction, query) {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true
  return getSearchableText(transaction).includes(normalized)
}

export function matchesFlowFilter(transaction, flow) {
  if (flow === 'all') return true
  if (flow === 'income') {
    return transaction.type === 'budget' || transaction.type === 'income'
  }
  if (flow === 'expense') {
    return transaction.type === 'expense'
  }
  return true
}

export function matchesKindFilter(transaction, kind) {
  if (kind === 'all') return true
  if (kind === 'budget') return transaction.type === 'budget'
  if (kind === 'expense') return transaction.type === 'expense'
  return true
}

export function matchesCategoryFilter(transaction, category) {
  if (category === 'all') return true
  return transaction.category === category
}

export function matchesDateFilter(transaction, date) {
  if (!date) return true
  const movementDate = transaction.date ?? transaction.createdAt?.slice(0, 10)
  return movementDate === date
}

export function matchesFavoriteFilter(transaction, favoriteFilter) {
  if (favoriteFilter === 'favorites') return isMovementFavorite(transaction)
  return true
}

export function matchesQuickRange(transaction, quickRange) {
  if (quickRange === 'all') return true

  const movementDate = getMovementDate(transaction)
  if (!movementDate) return false

  const now = new Date()

  if (quickRange === 'today') {
    return movementDate >= startOfDay(now) && movementDate <= endOfDay(now)
  }

  if (quickRange === 'week') {
    return movementDate >= startOfWeek(now) && movementDate <= endOfWeek(now)
  }

  if (quickRange === 'month') {
    return (
      movementDate.getMonth() === now.getMonth() &&
      movementDate.getFullYear() === now.getFullYear()
    )
  }

  return true
}

export function sortMovements(transactions, sortKey) {
  const sorted = [...transactions]

  switch (sortKey) {
    case 'oldest':
      return sorted.sort((a, b) => getMovementTimestamp(a) - getMovementTimestamp(b))
    case 'expense-high':
      return sorted.sort((a, b) => {
        const aVal = a.type === 'expense' ? Math.abs(a.amount) : 0
        const bVal = b.type === 'expense' ? Math.abs(b.amount) : 0
        return bVal - aVal || getMovementTimestamp(b) - getMovementTimestamp(a)
      })
    case 'expense-low':
      return sorted.sort((a, b) => {
        const aVal = a.type === 'expense' ? Math.abs(a.amount) : Infinity
        const bVal = b.type === 'expense' ? Math.abs(b.amount) : Infinity
        if (aVal === Infinity && bVal === Infinity) {
          return getMovementTimestamp(b) - getMovementTimestamp(a)
        }
        return aVal - bVal || getMovementTimestamp(b) - getMovementTimestamp(a)
      })
    case 'income-high':
      return sorted.sort((a, b) => {
        const aVal =
          a.type === 'budget' || a.type === 'income' ? Math.abs(a.amount) : 0
        const bVal =
          b.type === 'budget' || b.type === 'income' ? Math.abs(b.amount) : 0
        return bVal - aVal || getMovementTimestamp(b) - getMovementTimestamp(a)
      })
    case 'newest':
    default:
      return sorted.sort((a, b) => getMovementTimestamp(b) - getMovementTimestamp(a))
  }
}

export function filterMovements(transactions, filters) {
  return transactions.filter(
    (transaction) =>
      matchesSearch(transaction, filters.query) &&
      matchesFlowFilter(transaction, filters.flow) &&
      matchesKindFilter(transaction, filters.kind) &&
      matchesCategoryFilter(transaction, filters.category) &&
      matchesDateFilter(transaction, filters.date) &&
      matchesQuickRange(transaction, filters.quickRange) &&
      matchesFavoriteFilter(transaction, filters.favoriteFilter),
  )
}

export function filterAndSortMovements(transactions, filters) {
  const filtered = filterMovements(transactions, filters)
  return sortMovements(filtered, filters.sort)
}

export function getAvailableCategories(transactions) {
  const categories = new Set()

  transactions.forEach((transaction) => {
    if (transaction.type === 'expense' && transaction.category) {
      categories.add(transaction.category)
    }
  })

  return [...categories].sort((a, b) => a.localeCompare(b, 'es'))
}

export function hasActiveMovementFilters(filters) {
  return (
    filters.query.trim() !== '' ||
    filters.flow !== 'all' ||
    filters.kind !== 'all' ||
    filters.category !== 'all' ||
    filters.date !== '' ||
    filters.quickRange !== 'all' ||
    filters.favoriteFilter !== 'all' ||
    filters.sort !== DEFAULT_MOVEMENT_FILTERS.sort
  )
}

/** Excluye favoritos del listado principal cuando hay sección destacada visible. */
export function excludeFavoritesFromList(transactions) {
  return transactions.filter((transaction) => !isMovementFavorite(transaction))
}
