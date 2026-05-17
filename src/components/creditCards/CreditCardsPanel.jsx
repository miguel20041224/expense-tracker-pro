import { useMemo, useState } from 'react'
import { CreditCardForm } from './CreditCardForm'
import { CreditCardVisual } from './CreditCardVisual'
import { CreditCardExpenseForm } from './CreditCardExpenseForm'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'
import { MovementItem } from '../dashboard/MovementItem'
import { IconCreditCard } from '../icons'
import { computeCreditCardStats, getCardExpenses } from '../../utils/creditCards'
import { sortTransactionsByDate } from '../../utils/transactions'
import { Money } from '../currency/Money'

export function CreditCardsPanel({
  cards,
  transactions,
  onAddCard,
  onDeleteCard,
  onAddCardExpense,
}) {
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
          Tarjetas de crédito
        </p>
        <p className="mt-1 text-sm text-slate-400">
          Controla el cupo, el saldo usado y el historial de cada tarjeta. Los cargos también
          aparecen en Movimientos.
        </p>
        {cards.length > 0 ? (
          <p className="mt-3 text-lg font-semibold text-white">
            Total usado: <Money value={totalSpentAll} className="text-expense" />
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
                title="Sin tarjetas registradas"
                description="Agrega tu primera tarjeta para ver cupo, uso y gastos asociados."
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
              <CardTitle>Historial · {selectedCard.name}</CardTitle>
              <span className="text-sm text-slate-500">
                <Money value={cardStats.get(selectedCard.id)?.spentFromMovements ?? 0} /> en cargos
              </span>
            </CardHeader>

            {selectedExpenses.length === 0 ? (
              <EmptyState
                title="Sin gastos en esta tarjeta"
                description="Registra un cargo o asigna movimientos existentes a esta tarjeta."
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
