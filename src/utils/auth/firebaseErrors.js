import { getFirebaseConsoleAuthUrl } from '../../firebase'

const CONSOLE_AUTH_HELP =
  'Abre Firebase Console → Authentication → Sign-in method → Email/Password → Activar → Guardar.'

export function mapFirebaseAuthError(error) {
  const code = error?.code ?? ''

  if (code === 'auth/configuration-not-found') {
    return new Error(
      `Email/Password no está activado en Firebase. ${CONSOLE_AUTH_HELP} ` +
        `Enlace: ${getFirebaseConsoleAuthUrl()}`,
    )
  }
  if (code === 'auth/invalid-api-key' || code === 'auth/api-key-not-valid') {
    return new Error('Clave de API de Firebase inválida. Contacta al administrador del proyecto.')
  }
  if (code === 'auth/operation-not-allowed') {
    return new Error(`El proveedor Email/Password está deshabilitado. ${CONSOLE_AUTH_HELP}`)
  }
  if (code === 'auth/email-already-in-use') {
    return new Error('Ya existe una cuenta con este correo.')
  }
  if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
    return new Error('Correo o contraseña incorrectos.')
  }
  if (code === 'auth/weak-password') {
    return new Error('La contraseña debe tener al menos 6 caracteres.')
  }
  if (code === 'auth/invalid-email') {
    return new Error('Correo no válido.')
  }
  if (code === 'auth/too-many-requests') {
    return new Error('Demasiados intentos. Espera un momento e inténtalo de nuevo.')
  }
  if (code === 'auth/network-request-failed') {
    return new Error('Sin conexión. Comprueba tu red e inténtalo de nuevo.')
  }

  return new Error(error?.message ?? 'Error de autenticación')
}

export function mapFirestoreError(error) {
  const code = error?.code ?? ''
  if (code === 'permission-denied') {
    return new Error(
      'Sin permiso en Firestore. Despliega firestore.rules y verifica que el usuario esté autenticado.',
    )
  }
  return new Error(error?.message ?? 'Error al guardar en Firestore')
}
