/**
 * Configuración web de Firebase (proyecto fintrack).
 * Lista para usar: no hace falta crear .env (las variables VITE_* lo sobrescriben si existen).
 */
export const FINTRACK_FIREBASE_CONFIG = {
  apiKey: 'AIzaSyB1D_TovhbuvgGgfkPtwBOwErS1npJPH4I',
  authDomain: 'fintrack.firebaseapp.com',
  projectId: 'fintrack-9b1a2',
  storageBucket: 'fintrack.firebasestorage.app',
  messagingSenderId: '714499441854',
  appId: '1:714499441854:web:749565b33ef1f018de8aef',
}

const ENV_MAP = {
  apiKey: 'VITE_FIREBASE_API_KEY',
  authDomain: 'VITE_FIREBASE_AUTH_DOMAIN',
  projectId: 'VITE_FIREBASE_PROJECT_ID',
  storageBucket: 'VITE_FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'VITE_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'VITE_FIREBASE_APP_ID',
}

/** Env opcional → si falta, usa FINTRACK_FIREBASE_CONFIG. */
export function resolveFirebaseConfig() {
  const config = { ...FINTRACK_FIREBASE_CONFIG }
  for (const [key, envKey] of Object.entries(ENV_MAP)) {
    const value = import.meta.env[envKey]
    if (value && String(value).trim()) {
      config[key] = String(value).trim()
    }
  }
  if (!config.authDomain && config.projectId) {
    config.authDomain = `${config.projectId}.firebaseapp.com`
  }
  if (!config.storageBucket && config.projectId) {
    config.storageBucket = `${config.projectId}.firebasestorage.app`
  }
  return config
}

export function isConfigComplete(config) {
  return Boolean(
    config?.apiKey &&
      config?.projectId &&
      config?.appId &&
      config?.messagingSenderId &&
      config?.authDomain,
  )
}
