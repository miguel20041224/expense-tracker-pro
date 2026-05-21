import { cn } from '../../utils/cn'

const EXPENSE_PRESETS = [0, 5, 10, 15]
const SAVINGS_PRESETS = [0, 10, 20]
const DEBT_PRESETS = [0, 25, 50, 100, 200]

export function ScenarioControls({
  expenseReductionPercent,
  savingsBoostPercent,
  extraDebtPayment,
  onExpenseChange,
  onSavingsChange,
  onDebtExtraChange,
}) {
  return (
    <div className="space-y-4">
      <PresetRow
        label="Reducir gastos"
        hint="Simula recorte en gastos del mes"
        presets={EXPENSE_PRESETS}
        value={expenseReductionPercent}
        onChange={onExpenseChange}
        suffix="%"
      />
      <PresetRow
        label="Impulso de ahorro"
        hint="Simula mayor margen mensual"
        presets={SAVINGS_PRESETS}
        value={savingsBoostPercent}
        onChange={onSavingsChange}
        suffix="%"
      />
      <PresetRow
        label="Pago extra deuda"
        hint="Monto adicional mensual (bola de nieve)"
        presets={DEBT_PRESETS}
        value={extraDebtPayment}
        onChange={onDebtExtraChange}
        formatValue={(v) => (v === 0 ? '0' : `+${v}`)}
      />
    </div>
  )
}

function PresetRow({ label, hint, presets, value, onChange, suffix = '', formatValue }) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-200">{label}</p>
      {hint ? <p className="mt-0.5 text-xs text-slate-500">{hint}</p> : null}
      <div className="mt-2 flex flex-wrap gap-2">
        {presets.map((preset) => {
          const active = value === preset
          const display = formatValue ? formatValue(preset) : `${preset}${suffix}`
          return (
            <button
              key={preset}
              type="button"
              onClick={() => onChange(preset)}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-xs font-medium transition',
                active
                  ? 'border-violet-500/50 bg-violet-500/15 text-white'
                  : 'border-border-subtle bg-white/5 text-slate-400 hover:border-white/15 hover:text-slate-200',
              )}
            >
              {display}
            </button>
          )
        })}
      </div>
    </div>
  )
}
