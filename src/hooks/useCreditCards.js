import { useEffect, useState } from 'react'
import {
  createCreditCard,
  normalizeCreditCards,
} from '../utils/creditCards'
import { readStorage, writeStorage } from '../utils/storage'

const STORAGE_KEY = 'finance-credit-cards'

export function useCreditCards() {
  const [cards, setCards] = useState(() =>
    normalizeCreditCards(readStorage(STORAGE_KEY, [])),
  )

  useEffect(() => {
    writeStorage(STORAGE_KEY, normalizeCreditCards(cards))
  }, [cards])

  function addCard(payload) {
    const card = createCreditCard(payload)
    setCards((prev) => [card, ...prev])
    return card
  }

  function updateCard(id, payload) {
    setCards((prev) =>
      normalizeCreditCards(
        prev.map((card) =>
          card.id === id
            ? {
                ...card,
                name: payload.name?.trim() ?? card.name,
                limit: payload.limit != null ? Math.abs(Number(payload.limit)) : card.limit,
                benefits: payload.benefits?.trim() ?? card.benefits,
                startingBalance:
                  payload.startingBalance != null
                    ? Math.max(0, Number(payload.startingBalance))
                    : card.startingBalance,
              }
            : card,
        ),
      ),
    )
  }

  function deleteCard(id) {
    setCards((prev) => prev.filter((c) => c.id !== id))
  }

  return {
    cards,
    addCard,
    updateCard,
    deleteCard,
    isEmpty: cards.length === 0,
  }
}
