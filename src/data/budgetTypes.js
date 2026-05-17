export const budgetTypes = [
  { id: 'monthly', label: 'mensual' },
  { id: 'weekly', label: 'semanal' },
  { id: 'daily', label: 'diario' },
]

export function getBudgetTypeLabel(budgetTypeId) {
  return budgetTypes.find((t) => t.id === budgetTypeId)?.label ?? budgetTypeId
}
