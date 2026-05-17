import { Money } from '../currency/Money'
import { useCurrency } from '../../hooks/useCurrency'
import { formatMovementDateTime, isBudgetTransaction } from '../../utils/budget'
import { getBudgetTypeLabel } from '../../data/budgetTypes'
import { cn } from '../../utils/cn'

const typeStyles = {
  income: 'text-income',
  expense: 'text-expense',
  savings: 'text-savings',
  budget: 'text-income',
}

function formatExpenseDate(isoDate) {
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(isoDate))
}

export function MovementItem({ transaction, className }) {
  const { currency } = useCurrency()
  const isBudget = isBudgetTransaction(transaction)
  const amountClass = typeStyles[transaction.type] ?? 'text-slate-300'

  return (
    <li
      className={cn(
        'flex items-start justify-between gap-4 py-3.5 motion-safe:animate-fade-in-up',
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'truncate font-medium',
            isBudget ? 'text-income' : 'text-slate-100',
          )}
        >
          {transaction.label}
        </p>

        {isBudget ? (
          <>
            <p className="mt-0.5 text-xs text-slate-500">
              {formatMovementDateTime(transaction.createdAt, currency.locale)}
            </p>
            <p className="mt-0.5 text-xs capitalize text-slate-500">
              {getBudgetTypeLabel(transaction.budgetType)}
            </p>
            {transaction.description ? (
              <p className="mt-0.5 truncate text-xs text-slate-400">{transaction.description}</p>
            ) : null}
          </>
        ) : (
          <p className="mt-0.5 text-xs text-slate-500">
            {transaction.category} · {formatExpenseDate(transaction.date)}
          </p>
        )}
      </div>

      <span className={cn('shrink-0 text-sm font-semibold tabular-nums', amountClass)}>
        {transaction.amount > 0 ? '+' : ''}
        <Money value={Math.abs(transaction.amount)} />
      </span>
    </li>
  )
}
