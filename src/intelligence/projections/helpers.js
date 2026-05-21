/** Utilidades de calendario y proyección lineal (sin dependencias de Firebase). */

export function getCalendarInfo(date = new Date()) {
  const year = date.getFullYear()
  const month = date.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const dayOfMonth = date.getDate()

  return { year, month, dayOfMonth, daysInMonth, date }
}

/** Extrapola un acumulado del mes al cierre según ritmo diario. */
export function linearMonthProjection(currentTotal, dayOfMonth, daysInMonth) {
  if (dayOfMonth <= 0 || daysInMonth <= 0) return null
  const daily = currentTotal / dayOfMonth
  return {
    projected: daily * daysInMonth,
    daily,
    daysRemaining: daysInMonth - dayOfMonth,
    dayOfMonth,
    daysInMonth,
  }
}

/** Promedio de los últimos N puntos de una serie numérica. */
export function averageRecent(values, count = 3) {
  const slice = values.filter((v) => Number.isFinite(v)).slice(-count)
  if (slice.length === 0) return 0
  return slice.reduce((a, b) => a + b, 0) / slice.length
}

/** Etiqueta corta para un mes futuro (offset desde hoy). */
export function futureMonthLabel(offsetMonths, locale = 'es') {
  const d = new Date()
  d.setMonth(d.getMonth() + offsetMonths)
  return d.toLocaleDateString(locale, { month: 'short', year: '2-digit' })
}

/** Clave ISO YYYY-MM para un mes con offset. */
export function futureMonthPrefix(offsetMonths) {
  const d = new Date()
  d.setMonth(d.getMonth() + offsetMonths)
  return d.toISOString().slice(0, 7)
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}
