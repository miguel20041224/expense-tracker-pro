import { Card, CardHeader, CardTitle } from '../ui/Card'
import { IconArrowRight } from '../icons'
import { formatCurrency } from '../../utils/format'
import { cn } from '../../utils/cn'

const typeStyles = {
  income: 'text-income',
  expense: 'text-expense',
  savings: 'text-savings',
}

function formatDate(isoDate) {
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(isoDate))
}

export function TransactionList({ transactions }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Últimos movimientos</CardTitle>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-400 transition hover:text-white"
        >
          Ver todos
          <IconArrowRight className="size-4" />
        </button>
      </CardHeader>

      <ul className="divide-y divide-border-subtle">
        {transactions.map((tx) => (
          <li key={tx.id} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
            <div className="min-w-0">
              <p className="truncate font-medium text-slate-100">{tx.label}</p>
              <p className="text-xs text-slate-500">
                {tx.category} · {formatDate(tx.date)}
              </p>
            </div>
            <span className={cn('shrink-0 text-sm font-semibold tabular-nums', typeStyles[tx.type])}>
              {tx.amount > 0 ? '+' : ''}
              {formatCurrency(Math.abs(tx.amount))}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
