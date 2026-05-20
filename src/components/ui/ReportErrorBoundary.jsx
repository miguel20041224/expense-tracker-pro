import { Component } from 'react'
import { Card } from './Card'
import { Button } from './Button'

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
      <Card className="border-rose-500/30 bg-rose-500/5 p-6">
        <h2 className="text-lg font-semibold text-rose-200">Error en reportes</h2>
        <p className="mt-2 text-sm text-slate-400">
          {this.state.error.message || 'No se pudo generar el reporte.'}
        </p>
        <Button
          type="button"
          className="mt-4"
          onClick={() => this.setState({ error: null })}
        >
          Reintentar
        </Button>
      </Card>
    )
  }
}
