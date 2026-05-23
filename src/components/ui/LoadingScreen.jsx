import { useTranslation } from 'react-i18next'

export function LoadingScreen({ message }) {
  const { t } = useTranslation('common')

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="flex flex-col items-center gap-4 motion-safe:animate-fade-in">
        <div
          className="size-9 animate-spin rounded-full border-2 border-accent/25 border-t-accent"
          role="status"
          aria-label={message ?? t('loading.app')}
        />
        <p className="text-sm font-medium text-slate-300">{message ?? t('loading.app')}</p>
        <p className="text-xs text-slate-500">{t('loading.appHint')}</p>
      </div>
    </div>
  )
}
