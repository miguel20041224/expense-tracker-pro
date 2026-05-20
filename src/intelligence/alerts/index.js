import { buildAlertKey, filterActiveAlerts } from './keys'
import { runAlertRules, insightsToAlerts } from './alertRules'

/**
 * @param {import('../types').FinancialContext} context
 * @param {import('../types').Insight[]} insights
 */
export function generateAlerts(context, insights = []) {
  const fromRules = runAlertRules(context)
  const fromInsights = insightsToAlerts(insights, context)
  const merged = [...fromRules, ...fromInsights]

  const seen = new Set()
  const all = []

  for (const item of merged) {
    const draft = {
      ...item,
      key: buildAlertKey(item),
      createdAt: new Date().toISOString(),
    }
    if (seen.has(draft.key)) continue
    seen.add(draft.key)
    all.push(draft)
  }

  all.sort((a, b) => (a.priority ?? 50) - (b.priority ?? 50))

  return all
}

export { buildAlertKey, filterActiveAlerts, getDismissedHistory } from './keys'
