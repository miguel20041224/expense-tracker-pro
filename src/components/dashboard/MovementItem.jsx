import { useTranslation } from 'react-i18next'
import { Money } from '../currency/Money'
import { useCurrency } from '../../hooks/useCurrency'
import { formatMovementDateTime } from '../../utils/movements'
import { MovementEditIndicator } from '../movements/MovementEditIndicator'
import { MovementFavoriteToggle } from '../movements/MovementFavoriteToggle'
import { isMovementFavorite } from '../../utils/movementFlags'
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

export function MovementItem({
  transaction,
  className,
  showTimeline = false,
  highlighted = false,
  onEdit,
  onDelete,
  onToggleFavorite,
  creditCardName,
}) {
  const { t } = useTranslation('forms')
  const { currency } = useCurrency()
  const isBudget = isBudgetTransaction(transaction)
  const isExpense = isExpenseTransaction(transaction)
  const amountClass = amountStyles[transaction.type] ?? 'text-slate-300'
  const typeLabel = t(`movements.types.${transaction.type}`, {
    defaultValue: t('movements.types.movement'),
  })
  const timestamp = transaction.createdAt ?? transaction.date
  const isFavorite = isMovementFavorite(transaction)
  const showActions = canMutateTransaction(transaction) && (onEdit || onDelete)
  const showFavoriteToggle = Boolean(onToggleFavorite)

  return (
    <li
      className={cn(
        'group relative motion-safe:animate-fade-in-up',
        showTimeline && 'pl-7',
        highlighted && 'rounded-xl bg-amber-500/5 px-2 -mx-2',
        isFavorite && !highlighted && 'rounded-xl ring-1 ring-inset ring-amber-500/10',
        className,
      )}
    >
      {showTimeline ? (
        <span
          className={cn(
            'absolute top-5 left-0 z-10 size-2.5 -translate-x-1/2 rounded-full ring-4 ring-surface-card',
            isFavorite ? 'bg-amber-400' : isBudget ? 'bg-income' : isExpense ? 'bg-expense' : 'bg-slate-500',
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
              isFavorite && 'text-slate-50',
            )}
          >
            {transaction.label}
          </p>

          {isExpense && transaction.category ? (
            <p className="mt-0.5 truncate text-xs text-slate-400">
              {transaction.category}
              {creditCardName ? ` · ${creditCardName}` : null}
            </p>
          ) : null}

          <p className="mt-0.5 text-xs text-slate-500">
            {formatMovementDateTime(timestamp, currency.locale)}
          </p>

          <MovementEditIndicator transaction={transaction} locale={currency.locale} />

          {isBudget ? (
            <>
              <p className="mt-0.5 text-xs capitalize text-slate-500">
                {t(`budget.types.${transaction.budgetType}`, {
                  defaultValue: getBudgetTypeLabel(transaction.budgetType),
                })}
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
          <div className="flex items-center gap-0.5">
            {showFavoriteToggle ? (
              <MovementFavoriteToggle
                transaction={transaction}
                onToggle={onToggleFavorite}
                className={cn(
                  'opacity-100 sm:opacity-70 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100',
                  isFavorite && 'opacity-100',
                )}
              />
            ) : null}

            <span className={cn('text-sm font-semibold tabular-nums', amountClass)}>
              {transaction.amount > 0 ? '+' : '-'}
              <Money value={Math.abs(transaction.amount)} />
            </span>
          </div>

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
