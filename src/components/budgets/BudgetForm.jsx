import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { FormField } from '../ui/FormField'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { budgetTypes } from '../../data/budgetTypes'
import { useCurrency } from '../../hooks/useCurrency'
import {
  getEmptyBudgetForm,
  validateBudgetForm,
  hasValidationErrors,
} from '../../utils/validateBudget'

export function BudgetForm({ onSubmit }) {
  const { t } = useTranslation('forms')
  const { currencyCode, amountPlaceholder, formatCurrency, parseAmount, currency } = useCurrency()
  const [values, setValues] = useState(getEmptyBudgetForm)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const amountExample = formatCurrency(2000000)

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
    const validationErrors = validateBudgetForm(values, currency.locale, t)
    setErrors(validationErrors)

    if (hasValidationErrors(validationErrors)) {
      return
    }

    const amount = parseAmount(values.amount)

    onSubmit?.({
      amount,
      budgetType: values.budgetType,
      description: values.description.trim() || undefined,
    })

    setValues(getEmptyBudgetForm())
    setErrors({})
    setSubmitted(true)
    window.setTimeout(() => setSubmitted(false), 3000)
  }

  function handleReset() {
    setValues(getEmptyBudgetForm())
    setErrors({})
    setSubmitted(false)
  }

  return (
    <Card className="motion-safe:animate-fade-in-up">
      <CardHeader>
        <CardTitle>{t('budget.form.title')}</CardTitle>
        {submitted ? (
          <span className="text-xs font-medium text-income">{t('budget.form.submitted')}</span>
        ) : null}
      </CardHeader>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label={t('fields.montoWithCurrency', { currency: currencyCode })}
            htmlFor="budget-amount"
            error={errors.amount}
            hint={t('fields.exampleHint', { example: amountExample })}
          >
            <Input
              id="budget-amount"
              name="amount"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder={amountPlaceholder}
              value={values.amount}
              onChange={updateField('amount')}
              error={errors.amount}
              aria-describedby={errors.amount ? 'budget-amount-error' : 'budget-amount-hint'}
            />
          </FormField>

          <FormField label={t('fields.budgetType')} htmlFor="budget-type" error={errors.budgetType}>
            <Select
              id="budget-type"
              name="budgetType"
              value={values.budgetType}
              onChange={updateField('budgetType')}
              error={errors.budgetType}
              aria-describedby={errors.budgetType ? 'budget-type-error' : undefined}
            >
              <option value="">{t('budget.form.selectType')}</option>
              {budgetTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {t(`budget.types.${type.id}`, { defaultValue: type.label })}
                </option>
              ))}
            </Select>
          </FormField>
        </div>

        <FormField
          label={t('fields.descriptionOptional')}
          htmlFor="budget-description"
          error={errors.description}
        >
          <Input
            id="budget-description"
            name="description"
            type="text"
            placeholder={t('budget.form.descriptionPlaceholder')}
            value={values.description}
            onChange={updateField('description')}
            error={errors.description}
            autoComplete="off"
            aria-describedby={errors.description ? 'budget-description-error' : undefined}
          />
        </FormField>

        <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={handleReset}>
            {t('actions.clear')}
          </Button>
          <Button type="submit" size="lg">
            {t('budget.form.submit')}
          </Button>
        </div>
      </form>
    </Card>
  )
}
