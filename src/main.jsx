import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const rootEl = document.getElementById('root')

if (import.meta.env.DEV) {
  console.log('[App] bootstrap', { hasRoot: Boolean(rootEl) })
}

if (!rootEl) {
  console.error('[App] No se encontró #root en index.html')
} else {
  createRoot(rootEl).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
  if (import.meta.env.DEV) {
    console.log('[App] React montado')
  }
}
