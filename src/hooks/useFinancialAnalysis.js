import { useMemo } from 'react'
import { runFinancialAnalysis, filterActiveAlerts } from '../intelligence'

/**
 * Análisis financiero memoizado para el dashboard (evita recalcular en cada render del padre).
 */
export function useFinancialAnalysis(financialData, dismissedAlerts = {}) {
  const analysis = useMemo(() => runFinancialAnalysis(financialData), [financialData])

  const activeAlerts = useMemo(
    () => filterActiveAlerts(analysis.alerts, dismissedAlerts),
    [analysis.alerts, dismissedAlerts],
  )

  return { analysis, activeAlerts }
}
