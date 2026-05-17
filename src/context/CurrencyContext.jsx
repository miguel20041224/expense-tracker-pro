import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import {
  CURRENCY_STORAGE_KEY,
  DEFAULT_CURRENCY_CODE,
  getCurrencyByCode,
  isSupportedCurrencyCode,
} from '../config/currencies'
import {
  createCurrencyFormatters,
  getAmountPlaceholder,
  getCurrencySymbol,
  parseAmountInput,
} from '../utils/format'

export const CurrencyContext = createContext(null)

function readStoredCurrencyCode() {
  try {
    const stored = localStorage.getItem(CURRENCY_STORAGE_KEY)
    if (stored && isSupportedCurrencyCode(stored)) {
      return stored
    }
  } catch {
    /* localStorage unavailable */
  }
  return DEFAULT_CURRENCY_CODE
}

export function CurrencyProvider({ children }) {
  const [currencyCode, setCurrencyCode] = useState(readStoredCurrencyCode)

  const currency = useMemo(() => getCurrencyByCode(currencyCode), [currencyCode])

  const { formatCurrency, formatCompact } = useMemo(
    () => createCurrencyFormatters(currency),
    [currency],
  )

  const currencySymbol = useMemo(() => getCurrencySymbol(currency), [currency])

  const amountPlaceholder = useMemo(() => getAmountPlaceholder(currency), [currency])

  const parseAmount = useCallback(
    (raw) => parseAmountInput(raw, currency.locale),
    [currency.locale],
  )

  useEffect(() => {
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, currencyCode)
    } catch {
      /* localStorage unavailable */
    }
  }, [currencyCode])

  const selectCurrency = useCallback((code) => {
    if (isSupportedCurrencyCode(code)) {
      setCurrencyCode(code)
    }
  }, [])

  const value = useMemo(
    () => ({
      currency,
      currencyCode,
      currencySymbol,
      amountPlaceholder,
      formatCurrency,
      formatCompact,
      parseAmount,
      selectCurrency,
    }),
    [
      currency,
      currencyCode,
      currencySymbol,
      amountPlaceholder,
      formatCurrency,
      formatCompact,
      parseAmount,
      selectCurrency,
    ],
  )

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}
