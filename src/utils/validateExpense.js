import { parseAmountInput } from './format'

export function getEmptyExpenseForm() {
  return {
    name: '',
    amount: '',
    category: '',
    date: new Date().toISOString().slice(0, 10),
    description: '',
    creditCardId: '',
    paymentMethod: 'cash',
  }
}

export const initialExpenseForm = getEmptyExpenseForm()

function validationMessage(t, key) {
  return t(`validation.${key}`, { ns: 'forms' })
}

export function validateExpenseForm(values, locale, t) {
  const errors = {}

  const name = values.name.trim()
  if (!name) {
    errors.name = validationMessage(t, 'requiredName')
  } else if (name.length < 2) {
    errors.name = validationMessage(t, 'nameMinLength')
  }

  const amount = parseAmountInput(values.amount, locale)
  if (values.amount === '' || values.amount == null) {
    errors.amount = validationMessage(t, 'requiredAmount')
  } else if (Number.isNaN(amount) || amount <= 0) {
    errors.amount = validationMessage(t, 'invalidAmountPositive')
  }

  if (!values.category) {
    errors.category = validationMessage(t, 'selectCategory')
  }

  if (!values.date) {
    errors.date = validationMessage(t, 'requiredDate')
  } else {
    const parsed = new Date(`${values.date}T12:00:00`)
    if (Number.isNaN(parsed.getTime())) {
      errors.date = validationMessage(t, 'invalidDate')
    } else {
      const today = new Date()
      today.setHours(23, 59, 59, 999)
      if (parsed > today) {
        errors.date = validationMessage(t, 'futureDate')
      }
    }
  }

  return errors
}

export function hasValidationErrors(errors) {
  return Object.keys(errors).length > 0
}

/** Validación para editar gasto (sin modificar fecha de creación). */
export function validateExpenseEditForm(values, locale, t) {
  const errors = {}

  const name = values.name.trim()
  if (!name) {
    errors.name = validationMessage(t, 'requiredName')
  } else if (name.length < 2) {
    errors.name = validationMessage(t, 'nameMinLength')
  }

  const amount = parseAmountInput(values.amount, locale)
  if (values.amount === '' || values.amount == null) {
    errors.amount = validationMessage(t, 'requiredAmount')
  } else if (Number.isNaN(amount) || amount <= 0) {
    errors.amount = validationMessage(t, 'invalidAmountPositive')
  }

  if (!values.category) {
    errors.category = validationMessage(t, 'selectCategory')
  }

  const description = values.description?.trim() ?? ''
  if (description.length > 200) {
    errors.description = validationMessage(t, 'descriptionMaxLength')
  }

  return errors
}
