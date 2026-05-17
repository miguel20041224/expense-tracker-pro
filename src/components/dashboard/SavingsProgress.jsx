import { Card, CardHeader, CardTitle } from '../ui/Card'
import { Money } from '../currency/Money'
import { cn } from '../../utils/cn'

/**
 * Progreso del presupuesto del mes (datos reales: asignado vs gastado).
 */
export function SavingsProgress({ income, expenses, remaining, isOverBudget }) {
  const spentPercent = income > 0 ? Math.min((expenses / income) * 100, 100) : 0
  const remainingPercent = income > 0 ? Math.max(100 - spentPercent, 0) : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Uso del presupuesto</CardTitle>
        <span className="text-sm font-medium text-slate-400">{spentPercent.toFixed(0)}% gastado</span>
      </CardHeader>

      <p className="text-2xl font-semibold tracking-tight text-white">
        <Money value={remaining} className={cn(isOverBudget && 'text-expense')} />
        <span className="text-base font-normal text-slate-500">
          {' '}
          disponibles de <Money value={income} />
        </span>
      </p>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            isOverBudget ? 'bg-expense' : 'bg-linear-to-r from-income to-savings',
          )}
          style={{ width: `${spentPercent}%` }}
          role="progressbar"
          aria-valuenow={spentPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Porcentaje del presupuesto gastado"
        />
      </div>

      <p className="mt-3 text-xs text-slate-500">
        {isOverBudget ? (
          <>
            Has superado tu presupuesto en <Money value={Math.abs(remaining)} />.
          </>
        ) : (
          <>
            Te queda un <span className="text-income">{remainingPercent.toFixed(0)}%</span> de tu
            presupuesto asignado este mes.
          </>
        )}
      </p>
    </Card>
  )
}
