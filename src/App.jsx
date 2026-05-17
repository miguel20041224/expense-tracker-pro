import { CurrencyProvider } from './context/CurrencyContext'
import { AuthProvider } from './context/AuthContext'
import { AppRoot } from './components/AppRoot'
import { AppErrorBoundary } from './components/ui/AppErrorBoundary'

export default function App() {
  return (
    <AppErrorBoundary>
      <AuthProvider>
        <CurrencyProvider>
          <AppRoot />
        </CurrencyProvider>
      </AuthProvider>
    </AppErrorBoundary>
  )
}
