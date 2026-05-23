import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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

export function CreditCardExpenseForm({ cardId, cardName, onSubmit }) {
  const { t } = useTranslation('forms')
  const { currency, currencyCode, amountPlaceholder, parseAmount } = useCurrency()
  const [values, setValues] = useState(() => ({
    ...getEmptyExpenseForm(),
    description: '',
  }))
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
    const validationErrors = validateExpenseForm(values, currency.locale, t)
    setErrors(validationErrors)
    if (hasValidationErrors(validationErrors)) return

    onSubmit?.({
      name: values.name.trim(),
      category: values.category,
      amount: parseAmount(values.amount),
      date: values.date,
      description: values.description.trim() || undefined,
      creditCardId: cardId,
    })

    setValues({ ...getEmptyExpenseForm(), description: '' })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('cards.expenseForm.title', { cardName })}</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormField label={t('fields.description')} htmlFor="card-expense-name" error={errors.name}>
          <Input
            id="card-expense-name"
            value={values.name}
            onChange={updateField('name')}
            placeholder={t('cards.expenseForm.namePlaceholder')}
            error={errors.name}
          />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label={t('fields.montoWithCurrency', { currency: currencyCode })}
            htmlFor="card-expense-amount"
            error={errors.amount}
          >
            <Input
              id="card-expense-amount"
              value={values.amount}
              onChange={updateField('amount')}
              placeholder={amountPlaceholder}
              inputMode="decimal"
              error={errors.amount}
            />
          </FormField>

          <FormField label={t('fields.date')} htmlFor="card-expense-date" error={errors.date}>
            <Input
              id="card-expense-date"
              type="date"
              value={values.date}
              onChange={updateField('date')}
              max={new Date().toISOString().slice(0, 10)}
              error={errors.date}
            />
          </FormField>
        </div>

        <FormField label={t('fields.category')} htmlFor="card-expense-category" error={errors.category}>
          <Select
            id="card-expense-category"
            value={values.category}
            onChange={updateField('category')}
            error={errors.category}
          >
            <option value="">{t('expenses.form.selectCategory')}</option>
            {expenseCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label={t('fields.notesOptional')} htmlFor="card-expense-desc">
          <Input
            id="card-expense-desc"
            value={values.description}
            onChange={updateField('description')}
            placeholder={t('cards.expenseForm.notesPlaceholder')}
          />
        </FormField>

        <div className="flex justify-end">
          <Button type="submit">{t('cards.expenseForm.submit')}</Button>
        </div>
      </form>
    </Card>
  )
}
