import { Header } from './Header'

export function AppShell({ children, activeTab, onTabChange }) {
  return (
    <div className="min-h-screen bg-surface">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-10 sm:px-6 lg:px-8">
        <Header activeTab={activeTab} onTabChange={onTabChange} />
        <main className="flex-1 pt-6 sm:pt-8">{children}</main>
      </div>
    </div>
  )
}
