/** Clave estable para persistir dismiss por período. */
export function buildAlertKey(alert) {
  const period = alert.periodKey ?? 'global'
  return `${alert.id}:${period}`
}

/**
 * @param {Array} alerts
 * @param {Record<string, string>} dismissedAlerts
 */
export function filterActiveAlerts(alerts, dismissedAlerts = {}) {
  return alerts.filter((a) => !dismissedAlerts[buildAlertKey(a)])
}

/**
 * @param {Array} alerts
 * @param {Record<string, string>} dismissedAlerts
 * @param {number} [limit]
 */
export function getDismissedHistory(alerts, dismissedAlerts = {}, limit = 5) {
  const entries = Object.entries(dismissedAlerts)
    .map(([key, dismissedAt]) => {
      const alert = alerts.find((a) => buildAlertKey(a) === key)
      return alert ? { ...alert, key, dismissedAt } : null
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.dismissedAt) - new Date(a.dismissedAt))

  return entries.slice(0, limit)
}
