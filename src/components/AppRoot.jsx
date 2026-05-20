import { useAuth } from '../context/AuthContext'
import { LoadingScreen } from './ui/LoadingScreen'
import AuthPage from '../pages/AuthPage'
import Dashboard from '../pages/Dashboard'

export function AppRoot() {
  const { user, authLoading } = useAuth()

  if (import.meta.env.DEV) {
    console.log('[AppRoot] render', { authLoading, hasUser: Boolean(user) })
  }

  if (authLoading) return <LoadingScreen />
  if (!user) return <AuthPage />
  return <Dashboard />
}
