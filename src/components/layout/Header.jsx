import { useAuth } from '../../context/AuthContext'
import { IconBell, IconWallet } from '../icons'
import { IconBadge } from '../ui/IconBadge'
import { Button } from '../ui/Button'
import { NAV_TABS } from '../../config/navigation'
import { cn } from '../../utils/cn'

export function Header({ activeTab = 'inicio', onTabChange, alertCount = 0 }) {
  const { user, logout } = useAuth()

  return (
    <header className="flex flex-col gap-4 border-b border-border-subtle py-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <IconBadge variant="accent">
            <IconWallet />
          </IconBadge>
          <div>
            <p className="text-xs font-medium tracking-widest text-slate-500 uppercase">
              Finanzas personales
            </p>
            <h1 className="text-lg font-semibold tracking-tight text-white">Vault</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {alertCount > 0 ? (
            <button
              type="button"
              onClick={() => onTabChange?.('alertas')}
              className="relative flex size-9 items-center justify-center rounded-lg bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
              aria-label={`${alertCount} alertas activas`}
            >
              <IconBell className="size-5" />
              <span className="absolute -top-0.5 -right-0.5 flex min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {alertCount > 9 ? '9+' : alertCount}
              </span>
            </button>
          ) : null}
          {user ? (
            <span className="hidden text-xs text-slate-500 sm:inline">{user.name}</span>
          ) : null}
          <Button type="button" variant="secondary" size="sm" onClick={logout}>
            Salir
          </Button>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto pb-1 sm:pb-0" aria-label="Navegación principal">
        {NAV_TABS.map((item) => {
          const isActive = activeTab === item.id
          const showBadge = item.id === 'alertas' && alertCount > 0
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange?.(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'relative shrink-0 rounded-lg px-3.5 py-2 text-sm font-medium transition',
                isActive
                  ? 'bg-white/8 text-white'
                  : 'text-slate-500 hover:bg-white/5 hover:text-slate-300',
              )}
            >
              {item.label}
              {showBadge ? (
                <span className="ml-1.5 inline-flex min-w-4 items-center justify-center rounded-full bg-rose-500/90 px-1 text-[10px] font-bold text-white">
                  {alertCount > 9 ? '9+' : alertCount}
                </span>
              ) : null}
            </button>
          )
        })}
      </nav>
    </header>
  )
}
