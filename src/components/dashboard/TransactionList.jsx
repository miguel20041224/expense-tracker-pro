import { Card, CardHeader, CardTitle } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'
import { IconReceipt } from '../icons'
import { MovementItem } from './MovementItem'
import { sortTransactionsByDate } from '../../utils/transactions'

export function TransactionList({
  transactions,
  isEmpty,
  limit,
  onEdit,
  onDelete,
  onToggleFavorite,
}) {
  const sorted = sortTransactionsByDate(transactions)
  const visible = limit ? sorted.slice(0, limit) : sorted

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
          description="Agrega un presupuesto en la pestaña Presupuesto o un gasto con el formulario de la izquierda."
        />
      ) : (
        <ul className="relative ml-1 border-l border-border-subtle">
          {visible.map((tx) => (
            <MovementItem
              key={tx.id}
              transaction={tx}
              showTimeline
              className="last:pb-0"
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </ul>
      )}
    </Card>
  )
}
