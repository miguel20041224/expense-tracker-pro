import { useState } from 'react'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { FormField } from '../ui/FormField'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { useCurrency } from '../../hooks/useCurrency'

function getEmptyForm() {
  return { name: '', balance: '', interestRate: '', minPayment: '' }
}

export function DebtForm({ onSubmit }) {
  const { currencyCode, amountPlaceholder, parseAmount } = useCurrency()
  const [values, setValues] = useState(getEmptyForm)
  const [errors, setErrors] = useState({})

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
    if (!values.name.trim()) nextErrors.name = 'Nombre obligatorio'

    const balance = parseAmount(values.balance)
    if (!values.balance || Number.isNaN(balance) || balance <= 0) {
      nextErrors.balance = 'Saldo inválido'
    }

    const minPayment = parseAmount(values.minPayment)
    if (!values.minPayment || Number.isNaN(minPayment) || minPayment <= 0) {
      nextErrors.minPayment = 'Pago mínimo inválido'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onSubmit?.({
      name: values.name.trim(),
      balance,
      interestRate: values.interestRate === '' ? null : Number(values.interestRate),
      minPayment,
    })

    setValues(getEmptyForm())
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar deuda</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormField label="Nombre" htmlFor="debt-name" error={errors.name}>
          <Input id="debt-name" value={values.name} onChange={updateField('name')} error={errors.name} />
        </FormField>

        <FormField
          label={`Saldo pendiente (${currencyCode})`}
          htmlFor="debt-balance"
          error={errors.balance}
        >
          <Input
            id="debt-balance"
            value={values.balance}
            onChange={updateField('balance')}
            placeholder={amountPlaceholder}
            inputMode="decimal"
            error={errors.balance}
          />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Tasa anual (%)" htmlFor="debt-rate" hint="Opcional">
            <Input
              id="debt-rate"
              type="number"
              min="0"
              step="0.1"
              value={values.interestRate}
              onChange={updateField('interestRate')}
              placeholder="Ej. 24"
            />
          </FormField>

          <FormField
            label={`Pago mínimo mensual (${currencyCode})`}
            htmlFor="debt-min"
            error={errors.minPayment}
          >
            <Input
              id="debt-min"
              value={values.minPayment}
              onChange={updateField('minPayment')}
              placeholder={amountPlaceholder}
              inputMode="decimal"
              error={errors.minPayment}
            />
          </FormField>
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="lg">
            Agregar deuda
          </Button>
        </div>
      </form>
    </Card>
  )
}
