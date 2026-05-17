import { Card, CardHeader, CardTitle } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'
import { IconReceipt } from '../icons'
import { Money } from '../currency/Money'
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

export function TransactionList({ transactions, isEmpty }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Últimos movimientos</CardTitle>
        {!isEmpty ? (
          <span className="text-xs text-slate-500">{transactions.length} en total</span>
        ) : null}
      </CardHeader>

      {isEmpty ? (
        <EmptyState
          icon={<IconReceipt className="size-6" />}
          title="Aún no has agregado movimientos"
          description="Empieza agregando tu primer gasto con el formulario de la izquierda."
        />
      ) : (
        <ul className="divide-y divide-border-subtle">
          {transactions.map((tx) => (
            <li
              key={tx.id}
              className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-100">{tx.label}</p>
                <p className="text-xs text-slate-500">
                  {tx.category} · {formatDate(tx.date)}
                </p>
              </div>
              <span className={cn('shrink-0 text-sm font-semibold tabular-nums', typeStyles[tx.type])}>
                {tx.amount > 0 ? '+' : ''}
                <Money value={Math.abs(tx.amount)} />
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
