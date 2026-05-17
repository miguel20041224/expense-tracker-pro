import { useState } from 'react'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { FormField } from '../ui/FormField'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { useCurrency } from '../../hooks/useCurrency'

function getEmptyForm() {
  return { name: '', limit: '', benefits: '', startingBalance: '' }
}

export function CreditCardForm({ onSubmit }) {
  const { currencyCode, amountPlaceholder, parseAmount } = useCurrency()
  const [values, setValues] = useState(getEmptyForm)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  function updateField(field) {
    return (event) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }))
      if (errors[field]) {
        setErrors((prev) => {
          const next = { ...prev }
          delete next[field]
          return next
        })
      }
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {}

    if (!values.name.trim()) nextErrors.name = 'El nombre es obligatorio'
    const limit = parseAmount(values.limit)
    if (!values.limit || Number.isNaN(limit) || limit <= 0) {
      nextErrors.limit = 'Introduce un cupo válido'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const startingBalance = values.startingBalance
      ? parseAmount(values.startingBalance)
      : 0

    onSubmit?.({
      name: values.name.trim(),
      limit,
      benefits: values.benefits.trim(),
      startingBalance: Number.isNaN(startingBalance) ? 0 : Math.max(0, startingBalance),
    })

    setValues(getEmptyForm())
    setSubmitted(true)
    window.setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nueva tarjeta</CardTitle>
        {submitted ? (
          <span className="text-xs font-medium text-income">Tarjeta agregada</span>
        ) : null}
      </CardHeader>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormField label="Nombre" htmlFor="card-name" error={errors.name}>
          <Input
            id="card-name"
            value={values.name}
            onChange={updateField('name')}
            placeholder="Ej. Visa Bancolombia"
            error={errors.name}
          />
        </FormField>

        <FormField
          label={`Cupo (${currencyCode})`}
          htmlFor="card-limit"
          error={errors.limit}
        >
          <Input
            id="card-limit"
            value={values.limit}
            onChange={updateField('limit')}
            placeholder={amountPlaceholder}
            inputMode="decimal"
            error={errors.limit}
          />
        </FormField>

        <FormField
          label={`Saldo usado inicial (${currencyCode})`}
          htmlFor="card-balance"
          hint="Opcional: cargos previos no registrados en la app"
        >
          <Input
            id="card-balance"
            value={values.startingBalance}
            onChange={updateField('startingBalance')}
            placeholder="0"
            inputMode="decimal"
          />
        </FormField>

        <FormField label="Beneficios" htmlFor="card-benefits">
          <Input
            id="card-benefits"
            value={values.benefits}
            onChange={updateField('benefits')}
            placeholder="Cashback, puntos, millas..."
          />
        </FormField>

        <div className="flex justify-end pt-1">
          <Button type="submit" size="lg">
            Guardar tarjeta
          </Button>
        </div>
      </form>
    </Card>
  )
}
