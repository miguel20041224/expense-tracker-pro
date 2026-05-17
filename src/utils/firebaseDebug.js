/** Logs de depuración de Firebase Auth (solo en desarrollo). */
export function logFirebaseAuth(label, detail) {
  if (!import.meta.env.DEV) return
  const payload = detail === undefined ? '' : detail
  console.log(`[Firebase Auth] ${label}`, payload)
}

export function logFirebaseConfig(config, missingKeys) {
  if (!import.meta.env.DEV) return
  console.log('[Firebase] Inicializando app', {
    projectId: config.projectId,
    authDomain: config.authDomain,
    hasApiKey: Boolean(config.apiKey),
    hasAppId: Boolean(config.appId),
    hasMessagingSenderId: Boolean(config.messagingSenderId),
  })
  if (missingKeys.length > 0) {
    console.error(
      '[Firebase] Faltan variables en .env (copia .env.example → .env):',
      missingKeys.join(', '),
    )
  }
}
