import { Component } from 'react'

export class AppErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[App] Error de render:', error, info.componentStack)
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    return (
      <div className="flex min-h-screen items-center justify-center bg-surface px-4">
        <div className="max-w-md rounded-2xl border border-rose-500/30 bg-surface-card p-6 text-center">
          <h1 className="text-lg font-semibold text-white">No se pudo cargar la aplicación</h1>
          <p className="mt-2 text-sm text-slate-400">
            {error.message || 'Error inesperado en la interfaz.'}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white"
          >
            Recargar
          </button>
        </div>
      </div>
    )
  }
}
