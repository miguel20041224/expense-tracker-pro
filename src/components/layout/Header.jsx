import { IconWallet } from '../icons'
import { IconBadge } from '../ui/IconBadge'
import { NAV_TABS } from '../../config/navigation'
import { cn } from '../../utils/cn'

export function Header({ activeTab = 'resumen', onTabChange }) {
  return (
    <header className="flex flex-col gap-4 border-b border-border-subtle py-5 sm:flex-row sm:items-center sm:justify-between">
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

      <nav className="flex gap-1 overflow-x-auto pb-1 sm:pb-0" aria-label="Navegación principal">
        {NAV_TABS.map((item) => {
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange?.(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'shrink-0 rounded-lg px-3.5 py-2 text-sm font-medium transition',
                isActive
                  ? 'bg-white/8 text-white'
                  : 'text-slate-500 hover:bg-white/5 hover:text-slate-300',
              )}
            >
              {item.label}
            </button>
          )
        })}
      </nav>
    </header>
  )
}
