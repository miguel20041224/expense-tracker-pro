import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { localizeIntelligenceMessage } from './localizeMessage'

export function useIntelligenceMessage() {
  const { t } = useTranslation(['dashboard', 'alerts', 'projections'])

  return useCallback((item) => localizeIntelligenceMessage(item, t), [t])
}
