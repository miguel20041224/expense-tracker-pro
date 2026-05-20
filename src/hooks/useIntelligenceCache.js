import { useCallback, useEffect, useState } from 'react'
import {
  patchFinancialData,
  subscribeFinancialData,
} from '../services/firestore/financialDataRepository'

const EMPTY_CACHE = {
  dismissedAlerts: {},
  lastSeenAt: null,
}

function resolveUserId(actor) {
  return actor?.uid ?? actor?.id
}

export function useIntelligenceCache(actor) {
  const userId = resolveUserId(actor)
  const [cache, setCache] = useState(EMPTY_CACHE)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setCache(EMPTY_CACHE)
      setLoading(false)
      return undefined
    }

    setLoading(true)
    const unsubscribe = subscribeFinancialData(userId, (data) => {
      const raw = data?.intelligenceCache ?? EMPTY_CACHE
      setCache({
        dismissedAlerts: raw.dismissedAlerts ?? {},
        lastSeenAt: raw.lastSeenAt ?? null,
      })
      setLoading(false)
    })

    return unsubscribe
  }, [userId])

  const dismissAlert = useCallback(
    async (alertKey) => {
      if (!userId || !alertKey) return
      setCache((prev) => {
        const dismissedAlerts = {
          ...prev.dismissedAlerts,
          [alertKey]: new Date().toISOString(),
        }
        patchFinancialData(userId, {
          intelligenceCache: { dismissedAlerts, lastSeenAt: prev.lastSeenAt },
        }).catch((err) => console.error('[Alerts] dismiss:', err))
        return { ...prev, dismissedAlerts }
      })
    },
    [userId],
  )

  const restoreAlert = useCallback(
    async (alertKey) => {
      if (!userId || !alertKey) return
      setCache((prev) => {
        const { [alertKey]: _, ...dismissedAlerts } = prev.dismissedAlerts
        patchFinancialData(userId, {
          intelligenceCache: { dismissedAlerts, lastSeenAt: prev.lastSeenAt },
        }).catch((err) => console.error('[Alerts] restore:', err))
        return { ...prev, dismissedAlerts }
      })
    },
    [userId],
  )

  const dismissAll = useCallback(
    async (alertKeys) => {
      if (!userId || !alertKeys?.length) return
      const now = new Date().toISOString()
      setCache((prev) => {
        const dismissedAlerts = { ...prev.dismissedAlerts }
        for (const key of alertKeys) {
          dismissedAlerts[key] = now
        }
        patchFinancialData(userId, {
          intelligenceCache: { dismissedAlerts, lastSeenAt: prev.lastSeenAt },
        }).catch((err) => console.error('[Alerts] dismissAll:', err))
        return { ...prev, dismissedAlerts }
      })
    },
    [userId],
  )

  const markAlertsSeen = useCallback(async () => {
    if (!userId) return
    const lastSeenAt = new Date().toISOString()
    setCache((prev) => {
      patchFinancialData(userId, {
        intelligenceCache: { dismissedAlerts: prev.dismissedAlerts, lastSeenAt },
      }).catch((err) => console.error('[Alerts] markSeen:', err))
      return { ...prev, lastSeenAt }
    })
  }, [userId])

  return {
    cache,
    loading,
    dismissAlert,
    restoreAlert,
    dismissAll,
    markAlertsSeen,
  }
}
