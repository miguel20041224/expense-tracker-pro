import { useAuth } from '../context/AuthContext'
import { ROLES } from '../utils/auth/constants'
import { LoadingScreen } from './ui/LoadingScreen'
import AuthPage from '../pages/AuthPage'
import Dashboard from '../pages/Dashboard'
import AdvisorDashboard from '../pages/AdvisorDashboard'

export function AppRoot() {
  const { user, authLoading } = useAuth()

  if (authLoading) return <LoadingScreen />
  if (!user) return <AuthPage />
  if (user.role === ROLES.ADVISOR) return <AdvisorDashboard />
  return <Dashboard />
}
