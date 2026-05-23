import { useTranslation } from 'react-i18next'
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
  creditCardNames,
}) {
  const { t } = useTranslation('forms')
  const sorted = sortTransactionsByDate(transactions)
  const visible = limit ? sorted.slice(0, limit) : sorted

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{t('movements.recent.title')}</CardTitle>
        {!isEmpty ? (
          <span className="text-xs text-slate-500">
            {t('movements.recent.totalCount', { count: transactions.length })}
          </span>
        ) : null}
      </CardHeader>

      {isEmpty ? (
        <EmptyState
          icon={<IconReceipt className="size-6" />}
          title={t('movements.recent.emptyTitle')}
          description={t('movements.recent.emptyDescription')}
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
              creditCardName={
                tx.creditCardId ? creditCardNames?.get(tx.creditCardId) : undefined
              }
            />
          ))}
        </ul>
      )}
    </Card>
  )
}
