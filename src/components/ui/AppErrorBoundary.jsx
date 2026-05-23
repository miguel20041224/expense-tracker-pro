import { Component } from 'react'
import { useTranslation } from 'react-i18next'

function AppErrorFallback({ error, componentStack }) {
  const { t } = useTranslation(['common', 'forms'])
  const isDev = import.meta.env.DEV

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="max-w-lg rounded-2xl border border-rose-500/30 bg-surface-card p-6">
        <h1 className="text-lg font-semibold text-white">{t('errors.appTitle')}</h1>
        <p className="mt-2 text-sm text-rose-200">
          {error.message || t('errors.appMessage')}
        </p>
        {isDev && error.stack ? (
          <pre className="mt-4 max-h-40 overflow-auto rounded-lg bg-black/40 p-3 text-xs text-slate-400">
            {error.stack}
          </pre>
        ) : null}
        {isDev && componentStack ? (
          <pre className="mt-2 max-h-32 overflow-auto rounded-lg bg-black/40 p-3 text-xs text-slate-500">
            {componentStack}
          </pre>
        ) : null}
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 w-full rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white"
        >
          {t('actions.reload', { ns: 'common' })}
        </button>
      </div>
    </div>
  )
}

export class AppErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null, componentStack: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[App] Error de render:', error)
    if (info?.componentStack) {
      console.error('[App] componentStack:', info.componentStack)
    }
    this.setState({ componentStack: info?.componentStack ?? null })
  }

  render() {
    const { error, componentStack } = this.state
    if (!error) return this.props.children

    return <AppErrorFallback error={error} componentStack={componentStack} />
  }
}
