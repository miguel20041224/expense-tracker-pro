import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { FormField } from '../ui/FormField'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { ProgressBar } from '../ui/ProgressBar'
import { Money } from '../currency/Money'
import { INCOME_PERIOD_TYPES } from '../../data/incomePeriods'
import { useCurrency } from '../../hooks/useCurrency'
import { periodToMonthlyAmount } from '../../utils/incomeBudget'

export function IncomeBudgetSettings({ income, overview, onSave, readOnly = false, loading = false }) {
  const { currencyCode, amountPlaceholder, parseAmount, formatCurrency } = useCurrency()
  const [type, setType] = useState(income?.type ?? 'monthly')
  const [amount, setAmount] = useState(income?.amount > 0 ? String(income.amount) : '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setType(income?.type ?? 'monthly')
    setAmount(income?.amount > 0 ? String(income.amount) : '')
  }, [income?.type, income?.amount])

  const previewMonthly = periodToMonthlyAmount(type, parseAmount(amount) || 0)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    const parsed = parseAmount(amount)
    if (!parsed || parsed <= 0) {
      setError('Ingresa un monto válido mayor a cero.')
      return
    }

    setSaving(true)
    try {
      await onSave?.({ type, amount: parsed })
      setSaved(true)
      window.setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(err.message ?? 'No se pudo guardar el ingreso.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="motion-safe:animate-fade-in-up">
      <CardHeader>
        <CardTitle>Ingreso por periodo</CardTitle>
        {saved ? <span className="text-xs font-medium text-income">Guardado</span> : null}
      </CardHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Periodo" htmlFor="income-type">
            <Select
              id="income-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              disabled={readOnly || loading}
            >
              {INCOME_PERIOD_TYPES.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField
            label={`Monto (${currencyCode})`}
            htmlFor="income-amount"
            error={error}
            hint={previewMonthly > 0 ? `≈ ${formatCurrency(previewMonthly)} / mes` : undefined}
          >
            <Input
              id="income-amount"
              type="text"
              inputMode="decimal"
              placeholder={amountPlaceholder}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={readOnly || loading}
              error={error}
            />
          </FormField>
        </div>

        {overview?.hasLimit ? (
          <div className="space-y-3 rounded-xl border border-border-subtle bg-white/5 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Presupuesto mensual</span>
              <Money value={overview.limit} className="font-medium text-white" />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Gastado este mes</span>
              <Money value={overview.spent} className="text-expense" />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Disponible</span>
              <Money
                value={overview.remaining}
                className={overview.isOverBudget ? 'text-expense' : 'text-income'}
              />
            </div>
            <ProgressBar
              value={Math.min(overview.usagePercent, 100)}
              variant={overview.isOverBudget ? 'expense' : 'default'}
            />
            <p className="text-xs text-slate-500">
              Uso del presupuesto: {Math.round(overview.usagePercent)}%
              {overview.isOverBudget ? ' · Presupuesto superado' : ''}
            </p>
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            Define tu ingreso para calcular presupuesto disponible, gasto restante y porcentaje de uso.
          </p>
        )}

        {!readOnly ? (
          <Button type="submit" className="w-full sm:w-auto" disabled={saving || loading}>
            {saving ? 'Guardando…' : 'Guardar ingreso'}
          </Button>
        ) : null}
      </form>
    </Card>
  )
}
