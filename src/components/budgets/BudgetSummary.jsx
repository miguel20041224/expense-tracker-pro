import { Card, CardHeader, CardTitle } from '../ui/Card'
import { Money } from '../currency/Money'
import { computeSummary, filterCurrentMonth } from '../../utils/finance'
import { isBudgetTransaction } from '../../utils/budget'

export function BudgetSummary({ transactions }) {
  const summary = computeSummary(transactions)
  const monthBudgets = filterCurrentMonth(transactions).filter(isBudgetTransaction)

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
          Aún no has asignado presupuesto este mes. Agrega uno para actualizar tu balance.
        </p>
      )}
    </Card>
  )
}
