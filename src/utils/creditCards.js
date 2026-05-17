import { createTransactionId } from './movements'
import { isExpenseTransaction } from './expense'

export function createCreditCardId() {
  return createTransactionId()
}

export function createCreditCard({ name, limit, benefits = '', startingBalance = 0 }) {
  return {
    id: createCreditCardId(),
    name: name.trim(),
    limit: Math.abs(Number(limit) || 0),
    benefits: benefits.trim(),
    startingBalance: Math.max(0, Number(startingBalance) || 0),
    createdAt: new Date().toISOString(),
  }
}

export function normalizeCreditCard(card) {
  if (!card || typeof card !== 'object') return null
  if (!card.id || !card.name) return null

  return {
    ...card,
    name: String(card.name).trim(),
    limit: Math.max(0, Number(card.limit) || 0),
    benefits: String(card.benefits ?? '').trim(),
    startingBalance: Math.max(0, Number(card.startingBalance) || 0),
  }
}

export function normalizeCreditCards(cards) {
  if (!Array.isArray(cards)) return []
  return cards.map(normalizeCreditCard).filter(Boolean)
}

export function getCardExpenses(transactions, cardId) {
  return transactions.filter(
    (t) => isExpenseTransaction(t) && t.creditCardId === cardId,
  )
}

export function sumCardSpent(transactions, cardId) {
  return getCardExpenses(transactions, cardId).reduce(
    (sum, t) => sum + Math.abs(t.amount),
    0,
  )
}

export function computeCreditCardStats(card, transactions) {
  const spentFromMovements = sumCardSpent(transactions, card.id)
  const usedBalance = card.startingBalance + spentFromMovements
  const limit = card.limit
  const available = Math.max(limit - usedBalance, 0)
  const usagePercent = limit > 0 ? Math.min((usedBalance / limit) * 100, 100) : 0
  const isOverLimit = limit > 0 && usedBalance > limit

  return {
    spentFromMovements,
    usedBalance,
    available,
    usagePercent,
    isOverLimit,
    expenseCount: getCardExpenses(transactions, card.id).length,
  }
}

export function getCreditCardById(cards, id) {
  return cards.find((c) => c.id === id) ?? null
}
