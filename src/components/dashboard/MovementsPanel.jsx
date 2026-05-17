import { Card, CardHeader, CardTitle } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'
import { IconReceipt } from '../icons'
import { MovementItem } from './MovementItem'
import { sortTransactionsByDate } from '../../utils/transactions'
import { cn } from '../../utils/cn'

export function MovementsPanel({ transactions, isEmpty }) {
  const sorted = sortTransactionsByDate(transactions)

  return (
    <Card className="flex flex-col motion-safe:animate-fade-in-up">
      <CardHeader>
        <CardTitle>Historial de movimientos</CardTitle>
        {!isEmpty ? (
          <span className="text-xs text-slate-500">{transactions.length} en total</span>
        ) : null}
      </CardHeader>

      {isEmpty ? (
        <EmptyState
          icon={<IconReceipt className="size-6" />}
          title="Sin movimientos registrados"
          description="Agrega un presupuesto en la pestaña Presupuesto o un gasto en Resumen para ver tu historial aquí."
        />
      ) : (
        <ul
          className={cn(
            'relative ml-1 border-l border-border-subtle',
            sorted.length > 0 && 'pb-1',
          )}
        >
          {sorted.map((tx) => (
            <MovementItem
              key={tx.id}
              transaction={tx}
              showTimeline
              className="last:pb-0"
            />
          ))}
        </ul>
      )}
    </Card>
  )
}
