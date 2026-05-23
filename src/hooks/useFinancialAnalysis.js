import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { runFinancialAnalysis, filterActiveAlerts } from '../intelligence'

/**
 * Análisis financiero memoizado para el dashboard (evita recalcular en cada render del padre).
 */
export function useFinancialAnalysis(financialData, dismissedAlerts = {}) {
  const { i18n } = useTranslation()
  const analysis = useMemo(
    () => runFinancialAnalysis(financialData),
    [financialData, i18n.language],
  )

  const activeAlerts = useMemo(
    () => filterActiveAlerts(analysis.alerts, dismissedAlerts),
    [analysis.alerts, dismissedAlerts],
  )

  return { analysis, activeAlerts }
}
