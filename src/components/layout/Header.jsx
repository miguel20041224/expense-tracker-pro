import { IconWallet } from '../icons'
import { IconBadge } from '../ui/IconBadge'

const navItems = ['Resumen', 'Movimientos', 'Presupuesto', 'Metas']

export function Header() {
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
        {navItems.map((item, index) => (
          <button
            key={item}
            type="button"
            className={
              index === 0
                ? 'shrink-0 rounded-lg bg-white/8 px-3.5 py-2 text-sm font-medium text-white'
                : 'shrink-0 rounded-lg px-3.5 py-2 text-sm font-medium text-slate-500 transition hover:bg-white/5 hover:text-slate-300'
            }
          >
            {item}
          </button>
        ))}
      </nav>
    </header>
  )
}
