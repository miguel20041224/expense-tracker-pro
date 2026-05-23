import { parseAmountInput } from './format'

export function getEmptyBudgetForm() {
  return {
    amount: '',
    budgetType: '',
    description: '',
  }
}

function validationMessage(t, key) {
  return t(`validation.${key}`, { ns: 'forms' })
}

export function validateBudgetForm(values, locale, t) {
  const errors = {}
  const amount = parseAmountInput(values.amount, locale)

  if (!values.amount?.trim() || !Number.isFinite(amount) || amount <= 0) {
    errors.amount = validationMessage(t, 'invalidAmountGreaterZero')
  }

  if (!values.budgetType) {
    errors.budgetType = validationMessage(t, 'selectBudgetType')
  }

  const description = values.description?.trim() ?? ''
  if (description.length > 200) {
    errors.description = validationMessage(t, 'descriptionMaxLength')
  }

  return errors
}

export function hasValidationErrors(errors) {
  return Object.keys(errors).length > 0
}
