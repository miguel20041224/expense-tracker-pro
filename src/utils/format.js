/**
 * @param {{ locale: string, code: string }} currency
 */
export function createCurrencyFormatters(currency) {
  const { locale, code } = currency

  const currencyFormatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const compactFormatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: code,
    notation: 'compact',
    maximumFractionDigits: 1,
  })

  return {
    formatCurrency: (value) => currencyFormatter.format(value),
    formatCompact: (value) => compactFormatter.format(value),
  }
}

/**
 * @param {{ locale: string, code: string }} currency
 */
export function getCurrencySymbol(currency) {
  const part = new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
  })
    .formatToParts(0)
    .find((p) => p.type === 'currency')

  return part?.value ?? currency.code
}

export function formatPercent(value) {
  return new Intl.NumberFormat('es-ES', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100)
}
