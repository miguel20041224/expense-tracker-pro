const MICRO_SPEND_MIN_COUNT = 4

/** @type {import('../types').InsightRule[]} */
export const habitRules = [
  {
    id: 'category-growth',
    priority: 18,
    evaluate(ctx) {
      const top = ctx.categoryGrowth[0]
      if (!top) return null

      const pct = Math.round(top.growthPercent)
      return {
        id: 'category-growth',
        type: 'warning',
        priority: 18,
        category: 'habits',
        text: `Tus gastos en "${top.name}" aumentaron ${pct}% respecto al mes pasado.`,
        params: { name: top.name, pct },
      }
    },
  },
  {
    id: 'micro-spends',
    priority: 22,
    evaluate(ctx) {
      const { microSpends } = ctx
      const { expenses } = ctx.metrics.summary
      if (
        microSpends.count < MICRO_SPEND_MIN_COUNT ||
        expenses <= 0 ||
        microSpends.sharePercent < 12
      ) {
        return null
      }

      const pct = Math.round(microSpends.sharePercent)
      return {
        id: 'micro-spends',
        type: 'info',
        priority: 22,
        category: 'habits',
        text: `Podrías ahorrar más reduciendo gastos hormiga: ${microSpends.count} gastos pequeños suman el ${pct}% del mes.`,
        params: { count: microSpends.count, pct },
      }
    },
  },
]
