import { useAuth } from '../../context/AuthContext'
import { IconBell, IconWallet } from '../icons'
import { IconBadge } from '../ui/IconBadge'
import { Button } from '../ui/Button'
import { LanguageSelector } from '../language/LanguageSelector'
import { useNavTabs } from '../../hooks/useNavTabs'
import { cn } from '../../utils/cn'
import { useTranslation } from 'react-i18next'

export function Header({ activeTab = 'inicio', onTabChange, alertCount = 0 }) {
  const { user, logout } = useAuth()
  const navTabs = useNavTabs()
  const { t } = useTranslation('common')

  return (
    <header className="sticky top-0 z-20 -mx-4 flex flex-col gap-4 border-b border-border-subtle bg-surface/90 px-4 py-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 lg:py-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <IconBadge variant="accent">
            <IconWallet />
          </IconBadge>
          <div>
            <p className="text-xs font-medium tracking-widest text-slate-500 uppercase">
              {t('app.tagline')}
            </p>
            <h1 className="text-lg font-semibold tracking-tight text-white">{t('app.name')}</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <LanguageSelector className="w-full sm:w-auto" />
          {alertCount > 0 ? (
            <button
              type="button"
              onClick={() => onTabChange?.('alertas')}
              className="relative flex size-9 items-center justify-center rounded-lg bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
              aria-label={t('alerts.activeCount', { count: alertCount })}
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
            {t('actions.logout')}
          </Button>
        </div>
      </div>

      <nav
        className="nav-scroll -mx-1 flex gap-1 overflow-x-auto overscroll-x-contain px-1 pb-1 sm:pb-0"
        aria-label={t('nav.main')}
      >
        {navTabs.map((item) => {
          const isActive = activeTab === item.id
          const showBadge = item.id === 'alertas' && alertCount > 0
          return (
            <button
              key={item.id}
              id={`tab-${item.id}`}
              type="button"
              onClick={() => onTabChange?.(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'relative shrink-0 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors duration-150',
                isActive
                  ? 'bg-white/10 text-white shadow-sm shadow-black/20'
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
