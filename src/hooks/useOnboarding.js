import { useEffect, useState } from 'react'

const STORAGE_KEY = 'finance-onboarding-dismissed'

export function useOnboarding(isEmpty) {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true'
    } catch {
      return false
    }
  })

  useEffect(() => {
    if (!isEmpty && !dismissed) {
      setDismissed(true)
      localStorage.setItem(STORAGE_KEY, 'true')
    }
  }, [isEmpty, dismissed])

  function dismiss() {
    setDismissed(true)
    localStorage.setItem(STORAGE_KEY, 'true')
  }

  const showOnboarding = isEmpty && !dismissed

  return { showOnboarding, dismissOnboarding: dismiss }
}
