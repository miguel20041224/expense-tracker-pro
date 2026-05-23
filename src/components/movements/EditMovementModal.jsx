import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '../ui/Modal'
import { FormField } from '../ui/FormField'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { expenseCategories } from '../../data/expenseCategories'
import { CreditCardSelect } from '../creditCards/CreditCardSelect'
import { budgetTypes } from '../../data/budgetTypes'
import { useCurrency } from '../../hooks/useCurrency'
import { isBudgetTransaction } from '../../utils/budget'
import { isExpenseTransaction } from '../../utils/expense'
import { formatMovementDateTime } from '../../utils/movements'
import { MovementEditIndicator } from './MovementEditIndicator'
import { getEditFormValues } from '../../utils/movementFormValues'
import { validateExpenseEditForm, hasValidationErrors } from '../../utils/validateExpense'
import { validateBudgetForm, hasValidationErrors as hasBudgetErrors } from '../../utils/validateBudget'

export function EditMovementModal({ transaction, open, onClose, onSave, creditCards = [] }) {
  const { t } = useTranslation('forms')
  const { currency, currencyCode, amountPlaceholder, parseAmount } = useCurrency()
  const [values, setValues] = useState(null)
  const [errors, setErrors] = useState({})

  const isExpense = transaction && isExpenseTransaction(transaction)
  const isBudget = transaction && isBudgetTransaction(transaction)
  const timestamp = transaction?.createdAt ?? transaction?.date

  useEffect(() => {
    if (!open || !transaction) {
      setValues(null)
      setErrors({})
      return
    }

    const form = getEditFormValues(transaction, currency.locale)
    setValues(form?.values ?? null)
    setErrors({})
  }, [open, transaction, currency.locale])

  if (!transaction || !values) return null

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

    if (isExpense) {
      const validationErrors = validateExpenseEditForm(values, currency.locale, t)
      setErrors(validationErrors)
      if (hasValidationErrors(validationErrors)) return

      onSave?.(transaction.id, {
        name: values.name.trim(),
        category: values.category,
        amount: parseAmount(values.amount),
        description: values.description.trim() || undefined,
        creditCardId: values.creditCardId || undefined,
      })
      return
    }

    if (isBudget) {
      const validationErrors = validateBudgetForm(values, currency.locale, t)
      setErrors(validationErrors)
      if (hasBudgetErrors(validationErrors)) return

      onSave?.(transaction.id, {
        amount: parseAmount(values.amount),
        budgetType: values.budgetType,
        description: values.description.trim() || undefined,
      })
    }
  }

  const title = isExpense ? t('dialogs.editMovement.editExpense') : t('dialogs.editMovement.editBudget')

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={t('dialogs.editMovement.description')}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="rounded-xl border border-border-subtle bg-surface/60 px-3.5 py-2.5">
          <p className="text-xs font-medium text-slate-500">{t('movements.audit.registeredAt')}</p>
          <p className="mt-0.5 text-sm text-slate-200">
            {formatMovementDateTime(timestamp, currency.locale)}
          </p>
          <MovementEditIndicator
            transaction={transaction}
            locale={currency.locale}
            className="mt-2 border-t border-border-subtle/80 pt-2"
          />
        </div>

        {isExpense ? (
          <>
            <FormField label={t('fields.name')} htmlFor="edit-name" error={errors.name}>
              <Input
                id="edit-name"
                name="name"
                type="text"
                value={values.name}
                onChange={updateField('name')}
                error={errors.name}
                autoComplete="off"
              />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label={t('fields.montoWithCurrency', { currency: currencyCode })}
                htmlFor="edit-amount"
                error={errors.amount}
              >
                <Input
                  id="edit-amount"
                  name="amount"
                  type="text"
                  inputMode="decimal"
                  placeholder={amountPlaceholder}
                  value={values.amount}
                  onChange={updateField('amount')}
                  error={errors.amount}
                />
              </FormField>

              <FormField label={t('fields.category')} htmlFor="edit-category" error={errors.category}>
                <Select
                  id="edit-category"
                  name="category"
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
            </div>

            <FormField
              label={t('fields.descriptionOptional')}
              htmlFor="edit-description"
              error={errors.description}
            >
              <Input
                id="edit-description"
                name="description"
                type="text"
                placeholder={t('dialogs.editMovement.notesPlaceholder')}
                value={values.description}
                onChange={updateField('description')}
                error={errors.description}
                autoComplete="off"
              />
            </FormField>

            {creditCards.length > 0 ? (
              <FormField label={t('fields.creditCardOptional')} htmlFor="edit-card">
                <CreditCardSelect
                  id="edit-card"
                  cards={creditCards}
                  value={values.creditCardId}
                  onChange={updateField('creditCardId')}
                />
              </FormField>
            ) : null}
          </>
        ) : null}

        {isBudget ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label={t('fields.montoWithCurrency', { currency: currencyCode })}
                htmlFor="edit-budget-amount"
                error={errors.amount}
              >
                <Input
                  id="edit-budget-amount"
                  name="amount"
                  type="text"
                  inputMode="decimal"
                  placeholder={amountPlaceholder}
                  value={values.amount}
                  onChange={updateField('amount')}
                  error={errors.amount}
                />
              </FormField>

              <FormField label={t('fields.type')} htmlFor="edit-budget-type" error={errors.budgetType}>
                <Select
                  id="edit-budget-type"
                  name="budgetType"
                  value={values.budgetType}
                  onChange={updateField('budgetType')}
                  error={errors.budgetType}
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
              htmlFor="edit-budget-description"
              error={errors.description}
            >
              <Input
                id="edit-budget-description"
                name="description"
                type="text"
                placeholder={t('budget.form.descriptionPlaceholder')}
                value={values.description}
                onChange={updateField('description')}
                error={errors.description}
                autoComplete="off"
              />
            </FormField>
          </>
        ) : null}

        <div className="flex flex-col-reverse gap-3 border-t border-border-subtle pt-4 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            {t('actions.cancel')}
          </Button>
          <Button type="submit" size="lg">
            {t('actions.saveChanges')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
