import { useAuth } from '../../context/AuthContext'
import { IconWallet } from '../icons'
import { IconBadge } from '../ui/IconBadge'
import { Button } from '../ui/Button'

export function AdvisorShell({ children, onRefresh }) {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-surface">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-72 w-72 rounded-full bg-violet-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-10 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-border-subtle py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <IconBadge variant="accent">
              <IconWallet />
            </IconBadge>
            <div>
              <p className="text-xs font-medium tracking-widest text-violet-400 uppercase">
                Panel asesor
              </p>
              <h1 className="text-lg font-semibold tracking-tight text-white">Vault Pro</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-white/5 px-3 py-1.5 text-xs text-slate-400">
              {user?.name} · Solo lectura
            </span>
            {onRefresh ? (
              <Button type="button" variant="secondary" size="sm" onClick={onRefresh}>
                Actualizar
              </Button>
            ) : null}
            <Button type="button" variant="secondary" size="sm" onClick={logout}>
              Cerrar sesión
            </Button>
          </div>
        </header>

        <main className="flex-1 pt-6 sm:pt-8">{children}</main>
      </div>
    </div>
  )
}
