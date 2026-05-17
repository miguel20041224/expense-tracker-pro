import { useEffect, useRef, useState } from 'react'
import { createCreditCard, normalizeCreditCards } from '../utils/creditCards'
import { subscribeFinancialData } from '../services/firestore/financialDataRepository'
import { saveClientCreditCards } from '../services/financialDataService'
import { canWriteFinancialData } from '../utils/auth/permissions'

function resolveUserId(actor) {
  return actor?.uid ?? actor?.id
}

export function useCreditCards(actor, options = {}) {
  const userId = resolveUserId(actor)
  const readOnly = options.readOnly ?? !canWriteFinancialData(actor, userId)
  const suppressWrite = useRef(true)

  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setCards([])
      setLoading(false)
      return undefined
    }

    setLoading(true)
    suppressWrite.current = true

    const unsubscribe = subscribeFinancialData(userId, (data) => {
      suppressWrite.current = true
      setCards(normalizeCreditCards(data.creditCards))
      setLoading(false)
    })

    return unsubscribe
  }, [userId])

  useEffect(() => {
    if (!userId || readOnly || loading) return undefined

    if (suppressWrite.current) {
      suppressWrite.current = false
      return undefined
    }

    const timer = setTimeout(() => {
      saveClientCreditCards(actor, userId, cards).catch((err) => {
        console.error('Error guardando tarjetas:', err)
      })
    }, 450)

    return () => clearTimeout(timer)
  }, [cards, userId, readOnly, loading, actor])

  function guardWrite(fn) {
    return (...args) => {
      if (readOnly) return undefined
      return fn(...args)
    }
  }

  const addCard = guardWrite((payload) => {
    const card = createCreditCard(payload)
    setCards((prev) => [card, ...prev])
    return card
  })

  const updateCard = guardWrite((id, payload) => {
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
  })

  const deleteCard = guardWrite((id) => {
    setCards((prev) => prev.filter((c) => c.id !== id))
  })

  return {
    cards,
    addCard,
    updateCard,
    deleteCard,
    isEmpty: !loading && cards.length === 0,
    loading,
    readOnly,
  }
}
