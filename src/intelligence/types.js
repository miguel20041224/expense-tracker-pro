/**
 * @typedef {'danger' | 'warning' | 'info' | 'success'} InsightSeverity
 */

/**
 * @typedef {Object} Insight
 * @property {string} id
 * @property {InsightSeverity} type
 * @property {string} text
 * @property {number} [priority] Menor = más importante
 * @property {string} [category] daily | weekly | monthly | habits | debt
 */

/**
 * @typedef {Object} FinancialContext
 * @property {Array} transactions
 * @property {Array} creditCards
 * @property {Array} goals
 * @property {Array} debts
 * @property {object|null} income
 * @property {ReturnType<import('./metrics').computeFinancialMetrics>} metrics
 * @property {import('./contextBuilder').TemporalSnapshot} temporal
 * @property {Array<{ name: string, amount: number, percent: number }>} categoriesCurrent
 * @property {Array<{ name: string, amount: number, percent: number }>} categoriesPrevious
 * @property {Array<{ name: string, current: number, previous: number, growthPercent: number }>} categoryGrowth
 * @property {{ count: number, total: number, sharePercent: number }} microSpends
 */

/**
 * @typedef {Object} InsightRule
 * @property {string} id
 * @property {number} priority
 * @property {(ctx: FinancialContext) => Insight|null} evaluate
 */

export {}
