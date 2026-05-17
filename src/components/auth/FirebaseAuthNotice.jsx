import { getFirebaseConsoleAuthUrl } from '../../firebase'

export function FirebaseAuthNotice({ message, consoleUrl }) {
  const href = consoleUrl ?? getFirebaseConsoleAuthUrl()
  const isAuthNotEnabled =
    message?.includes('Email/Password') ||
    message?.includes('configuration-not-found') ||
    message?.includes('operation-not-allowed')

  if (!message) return null

  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-3 text-sm text-amber-100" role="status">
      <p className="font-medium text-amber-50">Configuración de Firebase</p>
      <p className="mt-1 text-amber-200/90">{message}</p>
      {isAuthNotEnabled ? (
        <ol className="mt-2 list-inside list-decimal space-y-1 text-xs text-amber-200/80">
          <li>Abre Firebase Console → Authentication</li>
          <li>Pulsa &quot;Comenzar&quot; si es la primera vez</li>
          <li>Sign-in method → Email/Password → Activar → Guardar</li>
        </ol>
      ) : null}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-block text-xs font-medium text-accent underline-offset-2 hover:underline"
      >
        Abrir Firebase Console (Authentication)
      </a>
    </div>
  )
}
