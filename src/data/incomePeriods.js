export const INCOME_PERIOD_TYPES = [
  { id: 'daily', label: 'Diario' },
  { id: 'weekly', label: 'Semanal' },
  { id: 'biweekly', label: 'Quincenal' },
  { id: 'monthly', label: 'Mensual' },
]

export function getIncomePeriodLabel(typeId) {
  return INCOME_PERIOD_TYPES.find((t) => t.id === typeId)?.label ?? typeId
}
