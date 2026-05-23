import { Suspense } from 'react'
import { I18nextProvider } from 'react-i18next'
import './i18n'
import i18n from './i18n'
import { CurrencyProvider } from './context/CurrencyContext'
import { AuthProvider } from './context/AuthContext'
import { AppRoot } from './components/AppRoot'
import { AppErrorBoundary } from './components/ui/AppErrorBoundary'
import { LoadingScreen } from './components/ui/LoadingScreen'

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <AppErrorBoundary>
        <AuthProvider>
          <CurrencyProvider>
            <Suspense fallback={<LoadingScreen />}>
              <AppRoot />
            </Suspense>
          </CurrencyProvider>
        </AuthProvider>
      </AppErrorBoundary>
    </I18nextProvider>
  )
}
