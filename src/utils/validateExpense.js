export function getEmptyExpenseForm() {
  return {
    name: '',
    amount: '',
    category: '',
    date: new Date().toISOString().slice(0, 10),
  }
}

export const initialExpenseForm = getEmptyExpenseForm()

export function validateExpenseForm(values) {
  const errors = {}

  const name = values.name.trim()
  if (!name) {
    errors.name = 'El nombre es obligatorio'
  } else if (name.length < 2) {
    errors.name = 'Mínimo 2 caracteres'
  }

  const amount = parseFloat(String(values.amount).replace(',', '.'))
  if (values.amount === '' || values.amount == null) {
    errors.amount = 'La cantidad es obligatoria'
  } else if (Number.isNaN(amount) || amount <= 0) {
    errors.amount = 'Introduce un importe mayor que 0'
  }

  if (!values.category) {
    errors.category = 'Selecciona una categoría'
  }

  if (!values.date) {
    errors.date = 'La fecha es obligatoria'
  } else {
    const parsed = new Date(`${values.date}T12:00:00`)
    if (Number.isNaN(parsed.getTime())) {
      errors.date = 'Fecha no válida'
    } else {
      const today = new Date()
      today.setHours(23, 59, 59, 999)
      if (parsed > today) {
        errors.date = 'La fecha no puede ser futura'
      }
    }
  }

  return errors
}

export function hasValidationErrors(errors) {
  return Object.keys(errors).length > 0
}
