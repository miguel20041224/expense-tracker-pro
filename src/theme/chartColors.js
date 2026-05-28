/** Semantic colors for Recharts (reads CSS tokens when running in browser). */
const FALLBACK = {
  income: '#5eead4',
  expense: '#fda4af',
  savings: '#7dd3fc',
  accent: '#6ba3f7',
  grid: 'rgba(255, 255, 255, 0.08)',
  tick: '#94a3b8',
  category: ['#6ba3f7', '#5eead4', '#7dd3fc', '#fda4af', '#a5b4fc', '#94a3b8'],
}

function readToken(name) {
  if (typeof document === 'undefined') return null
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || null
}

export function getChartColor(token, fallbackKey) {
  return readToken(token) ?? FALLBACK[fallbackKey]
}

export const chartColors = {
  get income() {
    return getChartColor('--color-income', 'income')
  },
  get expense() {
    return getChartColor('--color-expense', 'expense')
  },
  get savings() {
    return getChartColor('--color-savings', 'savings')
  },
  get accent() {
    return getChartColor('--color-accent', 'accent')
  },
  get grid() {
    return FALLBACK.grid
  },
  get tick() {
    return FALLBACK.tick
  },
  get categoryPalette() {
    const keys = ['accent', 'income', 'savings', 'expense', 'accent', 'savings']
    return keys.map((key) => getChartColor(`--color-${key}`, key))
  },
}
