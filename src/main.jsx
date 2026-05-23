import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n'
import './index.css'
import App from './App.jsx'
import { LoadingScreen } from './components/ui/LoadingScreen'

const rootEl = document.getElementById('root')

if (import.meta.env.DEV) {
  console.log('[App] bootstrap', { hasRoot: Boolean(rootEl) })
}

if (!rootEl) {
  console.error('[App] No se encontró #root en index.html')
} else {
  window.addEventListener('error', (event) => {
    console.error('[App] window.error', event.error ?? event.message)
  })
  window.addEventListener('unhandledrejection', (event) => {
    console.error('[App] unhandledrejection', event.reason)
  })

  createRoot(rootEl).render(
    <StrictMode>
      <Suspense fallback={<LoadingScreen />}>
        <App />
      </Suspense>
    </StrictMode>,
  )
  if (import.meta.env.DEV) {
    console.log('[App] React montado')
  }
}
