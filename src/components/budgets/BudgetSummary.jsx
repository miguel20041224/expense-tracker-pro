import { Card, CardHeader, CardTitle } from '../ui/Card'
import { Money } from '../currency/Money'
import { ProgressBar } from '../ui/ProgressBar'
import { computeSummary, filterCurrentMonth } from '../../utils/finance'
import { isBudgetTransaction } from '../../utils/budget'

export function BudgetSummary({ transactions, income, overview }) {
  const summary = computeSummary(transactions, income)
  const monthBudgets = filterCurrentMonth(transactions).filter(isBudgetTransaction)

  if (overview?.hasConfiguredIncome) {
    return (
      <Card className="motion-safe:animate-fade-in-up">
        <CardHeader>
          <CardTitle>Resumen del presupuesto</CardTitle>
          <span className="text-xs text-slate-500">Basado en tu ingreso configurado</span>
        </CardHeader>
        <p className="text-3xl font-semibold tracking-tight text-income">
          <Money value={overview.remaining} />
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Disponible este mes · Gastado: <Money value={overview.spent} className="inline text-expense" /> de{' '}
          <Money value={overview.limit} className="inline text-slate-300" />
        </p>
        <div className="mt-4">
          <ProgressBar
            value={Math.min(overview.usagePercent, 100)}
            variant={overview.isOverBudget ? 'expense' : 'default'}
          />
          <p className="mt-2 text-xs text-slate-500">{Math.round(overview.usagePercent)}% del presupuesto usado</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="motion-safe:animate-fade-in-up">
      <CardHeader>
        <CardTitle>Presupuesto del mes</CardTitle>
        <span className="text-xs text-slate-500">{monthBudgets.length} asignaciones</span>
      </CardHeader>
      {summary.hasBudgets ? (
        <>
          <p className="text-3xl font-semibold tracking-tight text-income">
            <Money value={summary.budgets} />
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Total asignado este mes. Balance disponible:{' '}
            <Money value={summary.balance} className="text-slate-300" />.
          </p>
        </>
      ) : (
        <p className="text-sm text-slate-500">
          Configura tu ingreso arriba o agrega un presupuesto manual para actualizar tu balance.
        </p>
      )}
    </Card>
  )
}
