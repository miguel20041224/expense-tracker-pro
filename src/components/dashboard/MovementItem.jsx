import { Money } from '../currency/Money'
import { useCurrency } from '../../hooks/useCurrency'
import { formatMovementDateTime } from '../../utils/movements'
import { isBudgetTransaction } from '../../utils/budget'
import { isExpenseTransaction } from '../../utils/expense'
import { getBudgetTypeLabel } from '../../data/budgetTypes'
import { canMutateTransaction } from '../../utils/transactionMutations'
import { MovementActionButtons } from '../movements/MovementActionButtons'
import { cn } from '../../utils/cn'

const amountStyles = {
  income: 'text-income',
  expense: 'text-expense',
  savings: 'text-savings',
  budget: 'text-income',
}

const MOVEMENT_TYPE_LABELS = {
  budget: 'Presupuesto',
  expense: 'Gasto',
  income: 'Ingreso',
  savings: 'Ahorro',
}

export function MovementItem({
  transaction,
  className,
  showTimeline = false,
  onEdit,
  onDelete,
}) {
  const { currency } = useCurrency()
  const isBudget = isBudgetTransaction(transaction)
  const isExpense = isExpenseTransaction(transaction)
  const amountClass = amountStyles[transaction.type] ?? 'text-slate-300'
  const typeLabel = MOVEMENT_TYPE_LABELS[transaction.type] ?? 'Movimiento'
  const timestamp = transaction.createdAt ?? transaction.date
  const showActions = canMutateTransaction(transaction) && (onEdit || onDelete)

  return (
    <li
      className={cn(
        'group relative motion-safe:animate-fade-in-up',
        showTimeline && 'pl-7',
        className,
      )}
    >
      {showTimeline ? (
        <span
          className={cn(
            'absolute top-5 left-0 z-10 size-2.5 -translate-x-1/2 rounded-full ring-4 ring-surface-card',
            isBudget ? 'bg-income' : isExpense ? 'bg-expense' : 'bg-slate-500',
          )}
          aria-hidden
        />
      ) : null}

      <div className="flex items-start justify-between gap-3 py-3.5 sm:gap-4">
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              'truncate font-medium',
              isBudget && 'text-income',
              isExpense && 'text-expense',
              !isBudget && !isExpense && 'text-slate-100',
            )}
          >
            {transaction.label}
          </p>

          {isExpense && transaction.category ? (
            <p className="mt-0.5 truncate text-xs text-slate-400">{transaction.category}</p>
          ) : null}

          <p className="mt-0.5 text-xs text-slate-500">
            {formatMovementDateTime(timestamp, currency.locale)}
          </p>

          {isBudget ? (
            <>
              <p className="mt-0.5 text-xs capitalize text-slate-500">
                {getBudgetTypeLabel(transaction.budgetType)}
              </p>
              {transaction.description ? (
                <p className="mt-0.5 truncate text-xs text-slate-400">{transaction.description}</p>
              ) : null}
            </>
          ) : (
            <>
              <p
                className={cn(
                  'mt-0.5 text-xs font-medium',
                  isExpense ? 'text-expense/80' : 'text-slate-500',
                )}
              >
                {typeLabel}
              </p>
              {isExpense && transaction.description ? (
                <p className="mt-0.5 truncate text-xs text-slate-400">{transaction.description}</p>
              ) : null}
            </>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span className={cn('text-sm font-semibold tabular-nums', amountClass)}>
            {transaction.amount > 0 ? '+' : '-'}
            <Money value={Math.abs(transaction.amount)} />
          </span>

          {showActions ? (
            <MovementActionButtons
              className="opacity-100 sm:opacity-0 sm:transition sm:group-focus-within:opacity-100 sm:group-hover:opacity-100"
              onEdit={() => onEdit?.(transaction)}
              onDelete={() => onDelete?.(transaction)}
            />
          ) : null}
        </div>
      </div>
    </li>
  )
}
