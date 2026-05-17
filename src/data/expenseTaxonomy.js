/** Tipos de gasto para filtros y analítica (asesor). */
export const EXPENSE_TYPES = [
  { id: 'comida', label: 'Comida' },
  { id: 'transporte', label: 'Transporte' },
  { id: 'entretenimiento', label: 'Entretenimiento' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'otros', label: 'Otros' },
]

export const PAYMENT_METHODS = [
  { id: 'credit_card', label: 'Tarjeta de crédito' },
  { id: 'debit', label: 'Débito' },
  { id: 'cash', label: 'Efectivo' },
  { id: 'bank_transfer', label: 'Banco / transferencia' },
]

const EXPENSE_TYPE_KEYWORDS = {
  comida: ['aliment', 'comida', 'restaur', 'supermerc', 'mercad', 'café', 'cafe', 'food'],
  transporte: ['transport', 'gasolin', 'uber', 'taxi', 'metro', 'bus', 'peaje', 'vehícul'],
  entretenimiento: ['ocio', 'entreten', 'cine', 'netflix', 'spotify', 'streaming', 'hobby', 'viaje', 'juego'],
  servicios: ['servic', 'suscrip', 'vivienda', 'hogar', 'salud', 'utilidad', 'internet', 'teléfono', 'telefono', 'luz', 'agua'],
}

export function mapCategoryToExpenseType(category) {
  const name = String(category ?? '').toLowerCase().trim()
  if (!name) return 'otros'

  for (const [typeId, keywords] of Object.entries(EXPENSE_TYPE_KEYWORDS)) {
    if (keywords.some((k) => name.includes(k))) return typeId
  }
  return 'otros'
}

export function resolvePaymentMethod(transaction) {
  if (transaction?.paymentMethod) return transaction.paymentMethod
  if (transaction?.creditCardId) return 'credit_card'
  return 'cash'
}

export function getExpenseTypeLabel(typeId) {
  return EXPENSE_TYPES.find((t) => t.id === typeId)?.label ?? typeId
}

export function getPaymentMethodLabel(methodId) {
  return PAYMENT_METHODS.find((m) => m.id === methodId)?.label ?? methodId
}

/** Categorías únicas en transacciones (dinámico para filtro "otros"). */
export function collectDynamicCategories(transactions) {
  const set = new Set()
  for (const tx of transactions) {
    if (tx.type !== 'expense') continue
    const cat = tx.category?.trim()
    if (cat) set.add(cat)
  }
  return [...set].sort((a, b) => a.localeCompare(b, 'es'))
}
