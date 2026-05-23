import { useTranslation } from 'react-i18next'
import { getFirebaseConsoleAuthUrl } from '../../firebase'

export function FirebaseAuthNotice({ message, consoleUrl }) {
  const { t } = useTranslation('common')
  const href = consoleUrl ?? getFirebaseConsoleAuthUrl()
  const isAuthNotEnabled =
    message?.includes('Email/Password') ||
    message?.includes('configuration-not-found') ||
    message?.includes('operation-not-allowed')

  if (!message) return null

  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-3 text-sm text-amber-100" role="status">
      <p className="font-medium text-amber-50">{t('firebase.title')}</p>
      <p className="mt-1 text-amber-200/90">{message}</p>
      {isAuthNotEnabled ? (
        <ol className="mt-2 list-inside list-decimal space-y-1 text-xs text-amber-200/80">
          <li>{t('firebase.steps.openConsole')}</li>
          <li>{t('firebase.steps.getStarted')}</li>
          <li>{t('firebase.steps.enableEmail')}</li>
        </ol>
      ) : null}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-block text-xs font-medium text-accent underline-offset-2 hover:underline"
      >
        {t('firebase.openConsoleLink')}
      </a>
    </div>
  )
}
