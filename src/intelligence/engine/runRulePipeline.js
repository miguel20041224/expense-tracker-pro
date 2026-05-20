import { INSIGHT_RULES } from '../rules'

const MAX_INSIGHTS = 8

/**
 * Ejecuta todas las reglas y devuelve insights ordenados por prioridad.
 * @param {import('../types').FinancialContext} ctx
 * @returns {import('../types').Insight[]}
 */
export function runInsightRules(ctx) {
  const matched = []

  for (const rule of INSIGHT_RULES) {
    try {
      const insight = rule.evaluate(ctx)
      if (insight) {
        matched.push({
          ...insight,
          priority: insight.priority ?? rule.priority,
        })
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn(`[Intelligence] Regla ${rule.id} falló:`, err)
      }
    }
  }

  matched.sort((a, b) => (a.priority ?? 50) - (b.priority ?? 50))

  const seen = new Set()
  const deduped = []
  for (const item of matched) {
    if (seen.has(item.id)) continue
    seen.add(item.id)
    deduped.push(item)
    if (deduped.length >= MAX_INSIGHTS) break
  }

  if (deduped.length === 0) {
    return [
      {
        id: 'all-clear',
        type: 'info',
        priority: 99,
        category: 'monthly',
        text: 'Sin alertas críticas este mes. Mantén el seguimiento de gastos y metas.',
      },
    ]
  }

  return deduped
}
