import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CreditCardForm } from './CreditCardForm'
import { CreditCardVisual } from './CreditCardVisual'
import { CreditCardExpenseForm } from './CreditCardExpenseForm'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'
import { MovementItem } from '../dashboard/MovementItem'
import { IconCreditCard } from '../icons'
import { computeCreditCardStats, getCardExpenses } from '../../utils/creditCards'
import { sortTransactionsByDate } from '../../utils/transactions'
import { useCurrency } from '../../hooks/useCurrency'

export function CreditCardsPanel({
  cards,
  transactions,
  onAddCard,
  onDeleteCard,
  onAddCardExpense,
}) {
  const { t } = useTranslation('forms')
  const { formatCurrency } = useCurrency()
  const [selectedId, setSelectedId] = useState(cards[0]?.id ?? null)

  const selectedCard = cards.find((c) => c.id === selectedId) ?? cards[0] ?? null

  const cardStats = useMemo(() => {
    const map = new Map()
    for (const card of cards) {
      map.set(card.id, computeCreditCardStats(card, transactions))
    }
    return map
  }, [cards, transactions])

  const selectedExpenses = useMemo(() => {
    if (!selectedCard) return []
    return sortTransactionsByDate(getCardExpenses(transactions, selectedCard.id))
  }, [selectedCard, transactions])

  const totalSpentAll = useMemo(
    () =>
      cards.reduce((sum, card) => {
        const stats = cardStats.get(card.id)
        return sum + (stats?.usedBalance ?? 0)
      }, 0),
    [cards, cardStats],
  )

  function handleAddCard(payload) {
    const card = onAddCard?.(payload)
    if (card?.id) setSelectedId(card.id)
  }

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-border-subtle bg-surface-card/60 p-5">
        <p className="text-xs font-medium tracking-widest text-slate-500 uppercase">
          {t('cards.panel.eyebrow')}
        </p>
        <p className="mt-1 text-sm text-slate-400">
          {t('cards.panel.description')}
        </p>
        {cards.length > 0 ? (
          <p className="mt-3 text-lg font-semibold text-white">
            {t('cards.panel.totalUsed', { amount: formatCurrency(totalSpentAll) })}
          </p>
        ) : null}
      </header>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <CreditCardForm onSubmit={handleAddCard} />
        </div>

        <div className="lg:col-span-3">
          {cards.length === 0 ? (
            <Card>
              <EmptyState
                icon={<IconCreditCard className="size-6" />}
                title={t('cards.empty.title')}
                description={t('cards.empty.description')}
              />
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {cards.map((card) => (
                <CreditCardVisual
                  key={card.id}
                  card={card}
                  stats={cardStats.get(card.id)}
                  selected={selectedCard?.id === card.id}
                  onSelect={setSelectedId}
                  onDelete={onDeleteCard}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedCard ? (
        <div className="grid gap-4 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <CreditCardExpenseForm
              cardId={selectedCard.id}
              cardName={selectedCard.name}
              onSubmit={onAddCardExpense}
            />
          </div>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>{t('cards.history.title', { name: selectedCard.name })}</CardTitle>
              <span className="text-sm text-slate-500">
                {t('cards.history.chargesTotal', {
                  amount: formatCurrency(cardStats.get(selectedCard.id)?.spentFromMovements ?? 0),
                })}
              </span>
            </CardHeader>

            {selectedExpenses.length === 0 ? (
              <EmptyState
                title={t('cards.history.emptyTitle')}
                description={t('cards.history.emptyDescription')}
              />
            ) : (
              <ul className="divide-y divide-border-subtle">
                {selectedExpenses.map((transaction) => (
                  <MovementItem key={transaction.id} transaction={transaction} />
                ))}
              </ul>
            )}
          </Card>
        </div>
      ) : null}
    </section>
  )
}
