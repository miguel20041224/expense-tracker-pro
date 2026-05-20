/**
 * Configuración Firebase solo desde variables VITE_* (.env local).
 * Copia .env.example → .env y completa los valores.
 */

const ENV_KEYS = {
  apiKey: 'VITE_FIREBASE_API_KEY',
  authDomain: 'VITE_FIREBASE_AUTH_DOMAIN',
  projectId: 'VITE_FIREBASE_PROJECT_ID',
  storageBucket: 'VITE_FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'VITE_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'VITE_FIREBASE_APP_ID',
}

function readEnv(envKey) {
  const value = import.meta.env[envKey]
  return value && String(value).trim() ? String(value).trim() : ''
}

export function resolveFirebaseConfig() {
  const projectId = readEnv(ENV_KEYS.projectId)

  const config = {
    apiKey: readEnv(ENV_KEYS.apiKey),
    authDomain: readEnv(ENV_KEYS.authDomain),
    projectId,
    storageBucket: readEnv(ENV_KEYS.storageBucket),
    messagingSenderId: readEnv(ENV_KEYS.messagingSenderId),
    appId: readEnv(ENV_KEYS.appId),
  }

  if (!config.authDomain && projectId) {
    config.authDomain = `${projectId}.firebaseapp.com`
  }
  if (!config.storageBucket && projectId) {
    config.storageBucket = `${projectId}.firebasestorage.app`
  }

  return config
}

/** Lista de variables VITE_* faltantes (para mensajes de error). */
export function getMissingConfigKeys(config) {
  return Object.entries(ENV_KEYS)
    .filter(([configKey]) => !config[configKey])
    .map(([, envKey]) => envKey)
}

export function isConfigComplete(config) {
  return getMissingConfigKeys(config).length === 0
}
