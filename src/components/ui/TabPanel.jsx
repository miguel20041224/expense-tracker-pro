import { cn } from '../../utils/cn'

/** Contenedor de pestaña con transición suave y espaciado consistente. */
export function TabPanel({ tabId, activeTab, children, className }) {
  if (activeTab !== tabId) return null

  return (
    <div
      key={tabId}
      className={cn('space-y-6 motion-safe:animate-fade-in-up', className)}
      role="tabpanel"
      id={`panel-${tabId}`}
      aria-labelledby={`tab-${tabId}`}
    >
      {children}
    </div>
  )
}
