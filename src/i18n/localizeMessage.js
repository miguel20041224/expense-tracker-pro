import i18n from './index'

/**
 * Resuelve mensajes de insights/alertas usando claves i18n con fallback al texto original.
 * @param {{ id: string, text: string, category?: string, source?: string, params?: Record<string, unknown> }} item
 * @param {(key: string, options?: object) => string} t
 */
export function localizeIntelligenceMessage(item, t) {
  if (!item?.id) return item?.text ?? ''

  const ns = resolveMessageNamespace(item)
  let key = resolveMessageKey(item)

  if (item.id.startsWith('predict-cat-')) {
    key = 'insights.predict-cat'
    const name = item.params?.name ?? item.id.replace('predict-cat-', '')
    return t(key, {
      ns: 'projections',
      defaultValue: item.text,
      name,
      ...(item.params ?? {}),
    })
  }

  return t(key, {
    ns,
    defaultValue: item.text,
    ...(item.params ?? {}),
  })
}

function resolveMessageNamespace(item) {
  if (item.source === 'alert') return 'alerts'
  if (item.category === 'predictive') return 'projections'
  return 'dashboard'
}

function resolveMessageKey(item) {
  if (item.source === 'alert') return `messages.${item.id}`
  if (item.category === 'predictive') return `insights.${item.id}`
  return `insights.${item.id}`
}

/** Formatea montos según el idioma activo (para params de reglas). */
export function formatLocaleAmount(amount, locale = i18n.language) {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(amount)
}

/** Formatea porcentajes localizados. */
export function formatLocalePercent(value, locale = i18n.language) {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value)
}
