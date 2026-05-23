import i18n from './index'

/**
 * Opciones de localización para generadores de reportes.
 * @typedef {object} ReportLocaleOptions
 * @property {(key: string, params?: object) => string} [t]
 * @property {string} [locale]
 * @property {(item: object) => string} [localizeMessage]
 * @property {(rec: object | string) => string} [localizeHealthRecommendation]
 */

export function resolveReportLocale(options = {}) {
  const locale = options.locale ?? i18n.language ?? 'es'
  const t =
    options.t ??
    ((key, params = {}) => i18n.t(key, { ns: 'reports', ...params }))

  return { locale, t }
}

export function formatReportMoney(amount, locale) {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(amount)
}

export function localizeHealthRecommendation(rec, tDashboard) {
  const id = typeof rec === 'string' ? rec : rec.id
  const fallback = typeof rec === 'string' ? rec : rec.text
  const translate =
    tDashboard ??
    ((key, params = {}) => i18n.t(key, { ns: 'dashboard', ...params }))

  return translate(`health.recommendations.${id}`, {
    defaultValue: fallback,
    ...(typeof rec === 'object' ? rec.params : {}),
  })
}

export function pickLocalizedTips(insights, limit, localizeMessage) {
  return (insights ?? [])
    .filter((i) => i.type === 'danger' || i.type === 'warning' || i.type === 'success')
    .slice(0, limit)
    .map((i) => (localizeMessage ? localizeMessage(i) : i.text))
}

export function translateHealthLevel(levelId, levelLabel, tDashboard) {
  const translate =
    tDashboard ??
    ((key, params = {}) => i18n.t(key, { ns: 'dashboard', ...params }))

  return translate(`health.levels.${levelId}`, { defaultValue: levelLabel })
}
