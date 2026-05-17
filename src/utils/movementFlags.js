import { getMovementTimestamp } from './movements'

/** Campos de personalización por movimiento (extensible: pinned, tags, etc.). */
export const MOVEMENT_FLAG_FIELDS = Object.freeze(['isFavorite'])

export function isMovementFavorite(transaction) {
  return transaction?.isFavorite === true
}

/**
 * Normaliza favoritos al cargar desde localStorage.
 * Solo persiste isFavorite cuando es true.
 */
export function normalizeFavoriteMetadata(transaction) {
  if (!transaction || typeof transaction !== 'object') return transaction
  if (isMovementFavorite(transaction)) return transaction
  if ('isFavorite' in transaction) {
    const { isFavorite: _removed, ...rest } = transaction
    return rest
  }
  return transaction
}

/** Preserva banderas al editar contenido del movimiento. */
export function preserveMovementFlags(existing) {
  return isMovementFavorite(existing) ? { isFavorite: true } : {}
}

export function withFavoriteFlag(transaction, isFavorite) {
  if (!transaction) return transaction
  if (isFavorite) return { ...transaction, isFavorite: true }
  const { isFavorite: _removed, ...rest } = transaction
  return rest
}

export function toggleFavoriteFlag(transaction) {
  return withFavoriteFlag(transaction, !isMovementFavorite(transaction))
}

export function countFavoriteMovements(transactions) {
  if (!Array.isArray(transactions)) return 0
  let count = 0
  for (let i = 0; i < transactions.length; i += 1) {
    if (isMovementFavorite(transactions[i])) count += 1
  }
  return count
}

export function getFavoriteMovements(transactions, limit) {
  if (!Array.isArray(transactions)) return []

  const favorites = []
  for (let i = 0; i < transactions.length; i += 1) {
    if (isMovementFavorite(transactions[i])) favorites.push(transactions[i])
  }

  favorites.sort((a, b) => getMovementTimestamp(b) - getMovementTimestamp(a))

  return limit != null ? favorites.slice(0, limit) : favorites
}
