/** Hash local de demostración (no usar en producción). */
export function hashPassword(password) {
  const value = String(password ?? '')
  if (!value) return ''
  try {
    return btoa(unescape(encodeURIComponent(`vault:${value}`)))
  } catch {
    return ''
  }
}

export function verifyPassword(password, hash) {
  if (!hash) return false
  return hashPassword(password) === hash
}
