const DECIMAL_PLACEHOLDER = '@'

/**
 * @param {string} locale
 */
export function getNumberFormatSymbols(locale) {
  const parts = new Intl.NumberFormat(locale).formatToParts(1234567.89)

  return {
    group: parts.find((p) => p.type === 'group')?.value ?? ',',
    decimal: parts.find((p) => p.type === 'decimal')?.value ?? '.',
  }
}

/**
 * @param {{ locale: string, code: string, currencyDisplay?: string, minimumFractionDigits?: number, maximumFractionDigits?: number }} currency
 */
export function resolveCurrencyFormatOptions(currency) {
  const currencyDisplay = currency.currencyDisplay ?? 'symbol'

  const resolved = new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
    currencyDisplay,
  }).resolvedOptions()

  return {
    locale: currency.locale,
    style: 'currency',
    currency: currency.code,
    currencyDisplay,
    minimumFractionDigits:
      currency.minimumFractionDigits ?? resolved.minimumFractionDigits,
    maximumFractionDigits:
      currency.maximumFractionDigits ?? resolved.maximumFractionDigits,
  }
}

/**
 * @param {{ locale: string, code: string, currencyDisplay?: string, minimumFractionDigits?: number, maximumFractionDigits?: number }} currency
 */
export function createCurrencyFormatters(currency) {
  const options = resolveCurrencyFormatOptions(currency)

  const currencyFormatter = new Intl.NumberFormat(options.locale, options)

  const compactFormatter = new Intl.NumberFormat(options.locale, {
    style: 'currency',
    currency: options.currency,
    currencyDisplay: options.currencyDisplay,
    notation: 'compact',
    minimumFractionDigits: 0,
    maximumFractionDigits: Math.min(options.maximumFractionDigits, 1),
  })

  return {
    formatCurrency: (value) => {
      const numeric = Number(value)
      if (!Number.isFinite(numeric)) return '—'
      return currencyFormatter.format(numeric)
    },
    formatCompact: (value) => {
      const numeric = Number(value)
      if (!Number.isFinite(numeric)) return '—'
      return compactFormatter.format(numeric)
    },
  }
}

/**
 * @param {{ locale: string, code: string, currencyDisplay?: string, minimumFractionDigits?: number, maximumFractionDigits?: number }} currency
 */
export function getCurrencySymbol(currency) {
  const part = new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
    currencyDisplay: currency.currencyDisplay ?? 'symbol',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .formatToParts(0)
    .find((p) => p.type === 'currency')

  return part?.value ?? currency.code
}

/**
 * @param {{ locale: string, minimumFractionDigits?: number, maximumFractionDigits?: number }} currency
 */
export function getAmountPlaceholder(currency) {
  const options = resolveCurrencyFormatOptions(currency)
  const { decimal } = getNumberFormatSymbols(currency.locale)

  if (options.minimumFractionDigits === 0) {
    return '0'
  }

  return `0${decimal}${'0'.repeat(options.minimumFractionDigits)}`
}

/**
 * Interpreta texto ingresado por el usuario según separadores del locale.
 * @param {string|number} raw
 * @param {string} locale
 */
export function parseAmountInput(raw, locale) {
  if (raw === '' || raw == null) return NaN

  let normalized = String(raw).trim().replace(/[\s\u00A0]/g, '')
  if (!normalized) return NaN

  const { group, decimal } = getNumberFormatSymbols(locale)

  if (decimal && normalized.includes(decimal)) {
    const index = normalized.lastIndexOf(decimal)
    normalized =
      normalized.slice(0, index) + DECIMAL_PLACEHOLDER + normalized.slice(index + decimal.length)
  }

  if (group) {
    const escaped = group.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    normalized = normalized.replace(new RegExp(escaped, 'g'), '')
  }

  normalized = normalized.replace(DECIMAL_PLACEHOLDER, '.').replace(/[^\d.-]/g, '')

  const value = Number.parseFloat(normalized)
  return Number.isFinite(value) ? value : NaN
}

export function formatPercent(value) {
  return new Intl.NumberFormat('es-ES', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100)
}
