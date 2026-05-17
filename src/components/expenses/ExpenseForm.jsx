import { useState } from 'react'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { FormField } from '../ui/FormField'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { expenseCategories } from '../../data/expenseCategories'
import { useCurrency } from '../../hooks/useCurrency'
import {
  getEmptyExpenseForm,
  validateExpenseForm,
  hasValidationErrors,
} from '../../utils/validateExpense'

function createExpenseId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return String(Date.now())
}

export function ExpenseForm({ onSubmit }) {
  const { currency, currencyCode, amountPlaceholder, formatCurrency, parseAmount } = useCurrency()
  const [values, setValues] = useState(getEmptyExpenseForm)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const amountExample = formatCurrency(79000)

  function updateField(field) {
    return (event) => {
      const next = event.target.value
      setValues((prev) => ({ ...prev, [field]: next }))
      if (errors[field]) {
        setErrors((prev) => {
          const nextErrors = { ...prev }
          delete nextErrors[field]
          return nextErrors
        })
      }
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    const validationErrors = validateExpenseForm(values, currency.locale)
    setErrors(validationErrors)

    if (hasValidationErrors(validationErrors)) {
      return
    }

    const amount = parseAmount(values.amount)

    onSubmit?.({
      id: createExpenseId(),
      label: values.name.trim(),
      category: values.category,
      amount: -Math.abs(amount),
      type: 'expense',
      date: values.date,
    })

    setValues(getEmptyExpenseForm())
    setErrors({})
    setSubmitted(true)
    window.setTimeout(() => setSubmitted(false), 3000)
  }

  function handleReset() {
    setValues(getEmptyExpenseForm())
    setErrors({})
    setSubmitted(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agregar gasto</CardTitle>
        {submitted ? (
          <span className="text-xs font-medium text-income">Gasto registrado</span>
        ) : null}
      </CardHeader>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormField label="Nombre del gasto" htmlFor="expense-name" error={errors.name}>
          <Input
            id="expense-name"
            name="name"
            type="text"
            placeholder="Ej. Supermercado"
            value={values.name}
            onChange={updateField('name')}
            error={errors.name}
            autoComplete="off"
            aria-describedby={errors.name ? 'expense-name-error' : undefined}
          />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label={`Cantidad (${currencyCode})`}
            htmlFor="expense-amount"
            error={errors.amount}
            hint={`Ej. ${amountExample}`}
          >
            <Input
              id="expense-amount"
              name="amount"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder={amountPlaceholder}
              value={values.amount}
              onChange={updateField('amount')}
              error={errors.amount}
              aria-describedby={
                errors.amount ? 'expense-amount-error' : 'expense-amount-hint'
              }
            />
          </FormField>

          <FormField label="Fecha" htmlFor="expense-date" error={errors.date}>
            <Input
              id="expense-date"
              name="date"
              type="date"
              value={values.date}
              onChange={updateField('date')}
              error={errors.date}
              max={new Date().toISOString().slice(0, 10)}
              aria-describedby={errors.date ? 'expense-date-error' : undefined}
            />
          </FormField>
        </div>

        <FormField label="Categoría" htmlFor="expense-category" error={errors.category}>
          <Select
            id="expense-category"
            name="category"
            value={values.category}
            onChange={updateField('category')}
            error={errors.category}
            aria-describedby={errors.category ? 'expense-category-error' : undefined}
          >
            <option value="">Selecciona una categoría</option>
            {expenseCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </FormField>

        <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={handleReset}>
            Limpiar
          </Button>
          <Button type="submit" size="lg">
            Guardar gasto
          </Button>
        </div>
      </form>
    </Card>
  )
}
