import { buildFinancialContext } from './contextBuilder'
import { runInsightRules } from './engine/runRulePipeline'

/**
 * Genera insights desde el pipeline de reglas.
 * @param {import('./types').FinancialContext | object} contextOrData
 */
export function generateFinancialInsights(contextOrData) {
  if (contextOrData?.metrics && contextOrData?.temporal) {
    return runInsightRules(contextOrData)
  }
  return runInsightRules(buildFinancialContext(contextOrData ?? {}))
}
