import { getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import {
  getMissingConfigKeys,
  isConfigComplete,
  resolveFirebaseConfig,
} from './config/firebase.config'
import { logFirebaseConfig } from './utils/firebaseDebug'

export const firebaseConfig = resolveFirebaseConfig()

logFirebaseConfig(firebaseConfig, getMissingConfigKeys(firebaseConfig))

/** @type {import('firebase/app').FirebaseApp | null} */
export let app = null
/** @type {import('firebase/auth').Auth | null} */
export let auth = null
/** @type {import('firebase/firestore').Firestore | null} */
export let db = null
/** @type {Error | null} */
export let firebaseInitError = null

export const isFirebaseReady = () => Boolean(auth && db)

export function getFirebaseConsoleAuthUrl() {
  const projectId = firebaseConfig.projectId
  if (!projectId) return 'https://console.firebase.google.com/'
  return `https://console.firebase.google.com/project/${projectId}/authentication/providers`
}

function initFirebase() {
  if (!isConfigComplete(firebaseConfig)) {
    const message =
      'Configuración de Firebase incompleta. Revisa src/config/firebase.config.js o las variables VITE_FIREBASE_*.'
    console.warn('[Firebase]', message)
    return new Error(message)
  }

  try {
    app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)

    if (import.meta.env.DEV) {
      console.log('[Firebase] Auth y Firestore listos', {
        projectId: firebaseConfig.projectId,
        authDomain: firebaseConfig.authDomain,
        sameApp: auth.app === db.app,
      })
    }
    return null
  } catch (err) {
    app = null
    auth = null
    db = null
    console.error('[Firebase] No se pudo inicializar (la UI seguirá visible):', err)
    return err instanceof Error ? err : new Error(String(err))
  }
}

firebaseInitError = initFirebase()
