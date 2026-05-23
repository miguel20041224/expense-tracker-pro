import { Component } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from './Card'
import { Button } from './Button'

function ReportErrorFallback({ error, onRetry }) {
  const { t } = useTranslation(['common', 'forms'])

  return (
    <Card className="border-rose-500/30 bg-rose-500/5 p-6">
      <h2 className="text-lg font-semibold text-rose-200">{t('errors.reportTitle')}</h2>
      <p className="mt-2 text-sm text-slate-400">
        {error.message || t('reports.errorMessage', { ns: 'forms' })}
      </p>
      <Button type="button" className="mt-4" onClick={onRetry}>
        {t('actions.retry', { ns: 'forms' })}
      </Button>
    </Card>
  )
}

export class ReportErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[Reports] Error de render:', error, info?.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <ReportErrorFallback
        error={this.state.error}
        onRetry={() => this.setState({ error: null })}
      />
    )
  }
}
