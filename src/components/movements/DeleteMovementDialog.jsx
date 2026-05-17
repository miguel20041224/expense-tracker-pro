import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Money } from '../currency/Money'
import { formatMovementDateTime } from '../../utils/movements'
import { useCurrency } from '../../hooks/useCurrency'
import { isBudgetTransaction } from '../../utils/budget'
import { isExpenseTransaction } from '../../utils/expense'
import { cn } from '../../utils/cn'

export function DeleteMovementDialog({ transaction, open, onClose, onConfirm }) {
  const { currency } = useCurrency()

  if (!transaction) return null

  const isExpense = isExpenseTransaction(transaction)
  const isBudget = isBudgetTransaction(transaction)
  const timestamp = transaction.createdAt ?? transaction.date
  const amountClass = isExpense ? 'text-expense' : isBudget ? 'text-income' : 'text-slate-300'

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Eliminar movimiento"
      description="Esta acción no se puede deshacer. Se actualizarán balance, estadísticas y categorías."
      size="sm"
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3">
          <p className="font-medium text-slate-100">{transaction.label}</p>
          {isExpense && transaction.category ? (
            <p className="mt-0.5 text-xs text-slate-400">{transaction.category}</p>
          ) : null}
          <p className="mt-1 text-xs text-slate-500">
            {formatMovementDateTime(timestamp, currency.locale)}
          </p>
          <p className={cn('mt-2 text-sm font-semibold tabular-nums', amountClass)}>
            {transaction.amount > 0 ? '+' : '-'}
            <Money value={Math.abs(transaction.amount)} />
          </p>
        </div>

        <p className="text-sm text-slate-400">
          ¿Confirmas que deseas eliminar este movimiento de tu historial?
        </p>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="button"
            size="lg"
            className="bg-rose-600 shadow-rose-600/25 hover:bg-rose-500 focus-visible:ring-rose-500/40"
            onClick={() => onConfirm?.(transaction.id)}
          >
            Eliminar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
