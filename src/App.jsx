import { CurrencyProvider } from './context/CurrencyContext'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <CurrencyProvider>
      <Dashboard />
    </CurrencyProvider>
  )
}
