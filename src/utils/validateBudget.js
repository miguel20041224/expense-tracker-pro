import { parseAmountInput } from './format'

export function getEmptyBudgetForm() {
  return {
    amount: '',
    budgetType: '',
    description: '',
  }
}

export function validateBudgetForm(values, locale) {
  const errors = {}
  const amount = parseAmountInput(values.amount, locale)

  if (!values.amount?.trim() || !Number.isFinite(amount) || amount <= 0) {
    errors.amount = 'Ingresa un monto válido mayor a cero'
  }

  if (!values.budgetType) {
    errors.budgetType = 'Selecciona un tipo de presupuesto'
  }

  const description = values.description?.trim() ?? ''
  if (description.length > 200) {
    errors.description = 'Máximo 200 caracteres'
  }

  return errors
}

export function hasValidationErrors(errors) {
  return Object.keys(errors).length > 0
}
