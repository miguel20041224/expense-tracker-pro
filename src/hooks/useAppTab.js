import { useCallback, useEffect, useState } from 'react'
import { NAV_TABS } from '../config/navigation'

const TAB_IDS = new Set(NAV_TABS.map((t) => t.id))
const DEFAULT_TAB = 'inicio'

function tabFromHash() {
  const raw = window.location.hash.replace(/^#\/?/, '').split('?')[0]
  if (!raw || raw === '/') return DEFAULT_TAB
  const segment = raw.split('/').filter(Boolean)[0]
  return TAB_IDS.has(segment) ? segment : DEFAULT_TAB
}

function hashForTab(tabId) {
  return tabId === DEFAULT_TAB ? '#/' : `#/${tabId}`
}

/**
 * Sincroniza pestañas con la URL (#/deudas, #/proyecciones) sin React Router.
 */
export function useAppTab() {
  const [activeTab, setActiveTabState] = useState(tabFromHash)

  useEffect(() => {
    const syncFromHash = () => {
      const next = tabFromHash()
      setActiveTabState((prev) => (prev === next ? prev : next))
    }
    window.addEventListener('hashchange', syncFromHash)
    syncFromHash()
    return () => window.removeEventListener('hashchange', syncFromHash)
  }, [])

  const setActiveTab = useCallback((tabId) => {
    if (!TAB_IDS.has(tabId)) return
    setActiveTabState(tabId)
    const nextHash = hashForTab(tabId)
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${nextHash}`)
    }
  }, [])

  return { activeTab, setActiveTab }
}
