import { Card, CardHeader, CardTitle } from '../ui/Card'
import { Money } from '../currency/Money'
import { filterCurrentMonth } from '../../utils/finance'
import { isBudgetTransaction } from '../../utils/budget'

export function BudgetSummary({ transactions }) {
  const monthBudgets = filterCurrentMonth(transactions).filter(isBudgetTransaction)
  const total = monthBudgets.reduce((sum, t) => sum + t.amount, 0)

  return (
    <Card className="motion-safe:animate-fade-in-up">
      <CardHeader>
        <CardTitle>Presupuesto del mes</CardTitle>
        <span className="text-xs text-slate-500">{monthBudgets.length} asignaciones</span>
      </CardHeader>
      <p className="text-3xl font-semibold tracking-tight text-income">
        <Money value={total} />
      </p>
      <p className="mt-2 text-sm text-slate-500">
        Total asignado este mes. Cada nuevo presupuesto actualiza tu balance disponible.
      </p>
    </Card>
  )
}
