import { useState } from 'react'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { FormField } from '../ui/FormField'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { useCurrency } from '../../hooks/useCurrency'

function getEmptyForm() {
  return {
    name: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    autoContributionPercent: '',
  }
}

export function GoalForm({ onSubmit }) {
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
    if (!values.name.trim()) nextErrors.name = 'El nombre es obligatorio'

    const target = parseAmount(values.targetAmount)
    if (!values.targetAmount || Number.isNaN(target) || target <= 0) {
      nextErrors.targetAmount = 'Objetivo inválido'
    }

    const current = values.currentAmount ? parseAmount(values.currentAmount) : 0
    const percent = values.autoContributionPercent
      ? Number(values.autoContributionPercent)
      : 0
    if (percent < 0 || percent > 100) {
      nextErrors.autoContributionPercent = 'Entre 0 y 100'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onSubmit?.({
      name: values.name.trim(),
      targetAmount: target,
      currentAmount: Number.isNaN(current) ? 0 : Math.max(0, current),
      targetDate: values.targetDate || null,
      autoContributionPercent: percent,
    })

    setValues(getEmptyForm())
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nueva meta</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormField label="Nombre" htmlFor="goal-name" error={errors.name}>
          <Input id="goal-name" value={values.name} onChange={updateField('name')} error={errors.name} />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label={`Objetivo (${currencyCode})`}
            htmlFor="goal-target"
            error={errors.targetAmount}
          >
            <Input
              id="goal-target"
              value={values.targetAmount}
              onChange={updateField('targetAmount')}
              placeholder={amountPlaceholder}
              inputMode="decimal"
              error={errors.targetAmount}
            />
          </FormField>

          <FormField
            label={`Progreso actual (${currencyCode})`}
            htmlFor="goal-current"
          >
            <Input
              id="goal-current"
              value={values.currentAmount}
              onChange={updateField('currentAmount')}
              placeholder="0"
              inputMode="decimal"
            />
          </FormField>
        </div>

        <FormField label="Fecha objetivo" htmlFor="goal-date">
          <Input
            id="goal-date"
            type="date"
            value={values.targetDate}
            onChange={updateField('targetDate')}
          />
        </FormField>

        <FormField
          label="Aporte automático desde ingresos (%)"
          htmlFor="goal-auto"
          hint="Al registrar presupuesto/ingreso, se aporta este % a la meta"
          error={errors.autoContributionPercent}
        >
          <Input
            id="goal-auto"
            type="number"
            min="0"
            max="100"
            value={values.autoContributionPercent}
            onChange={updateField('autoContributionPercent')}
            placeholder="Ej. 10"
            error={errors.autoContributionPercent}
          />
        </FormField>

        <div className="flex justify-end">
          <Button type="submit" size="lg">
            Crear meta
          </Button>
        </div>
      </form>
    </Card>
  )
}
