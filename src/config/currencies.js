/** @typedef {{ code: string, locale: string, name: string, country: string, flag: string }} CurrencyConfig */

/** @type {CurrencyConfig[]} */
export const SUPPORTED_CURRENCIES = [
  { code: 'COP', locale: 'es-CO', name: 'Peso colombiano', country: 'Colombia', flag: '🇨🇴' },
  { code: 'USD', locale: 'en-US', name: 'Dólar estadounidense', country: 'Estados Unidos', flag: '🇺🇸' },
  { code: 'EUR', locale: 'es-ES', name: 'Euro', country: 'Unión Europea', flag: '🇪🇺' },
  { code: 'MXN', locale: 'es-MX', name: 'Peso mexicano', country: 'México', flag: '🇲🇽' },
  { code: 'ARS', locale: 'es-AR', name: 'Peso argentino', country: 'Argentina', flag: '🇦🇷' },
  { code: 'GBP', locale: 'en-GB', name: 'Libra esterlina', country: 'Reino Unido', flag: '🇬🇧' },
]

export const DEFAULT_CURRENCY_CODE = 'EUR'

export const CURRENCY_STORAGE_KEY = 'vault-selected-currency'

const currencyByCode = new Map(SUPPORTED_CURRENCIES.map((c) => [c.code, c]))

export function getCurrencyByCode(code) {
  return currencyByCode.get(code) ?? currencyByCode.get(DEFAULT_CURRENCY_CODE)
}

export function isSupportedCurrencyCode(code) {
  return currencyByCode.has(code)
}
