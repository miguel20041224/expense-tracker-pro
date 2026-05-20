const iconClass = 'size-5 shrink-0'

export function IconWallet({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5h15a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-9a2 2 0 012-2z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 11.5h2.5M3 10.5V6.75A2.25 2.25 0 015.25 4.5h13.5" />
    </svg>
  )
}

export function IconTrendUp({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l6-6 4 4 6-8" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 6h6v6" />
    </svg>
  )
}

export function IconTrendDown({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8l6 6 4-4 6 8" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 18h6v-6" />
    </svg>
  )
}

export function IconPiggyBank({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 10.5c0-3.038 2.462-5.5 5.5-5.5s5.5 2.462 5.5 5.5v1.5H6v-1.5z" />
      <circle cx="14.5" cy="9" r="0.75" fill="currentColor" stroke="none" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h11.5a3 3 0 013 3v1.5H6V12z" />
    </svg>
  )
}

export function IconChart({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 19V5M10 19V9M16 19v-6M22 19V11" />
    </svg>
  )
}

export function IconChevronDown({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
    </svg>
  )
}

export function IconArrowRight({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export function IconSearch({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path strokeLinecap="round" d="M20 20l-3.5-3.5" />
    </svg>
  )
}

export function IconFilter({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  )
}

export function IconX({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export function IconReceipt({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6l1 2h3v16l-3-2-3 2-3-2-3 2-3-2V5h3l1-2z" />
      <path strokeLinecap="round" d="M9 9h6M9 13h4" />
    </svg>
  )
}

export function IconPencil({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 4.5l3 3L8 19H5v-3L16.5 4.5z"
      />
    </svg>
  )
}

export function IconStar({ className = iconClass, filled = false }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 2.5l2.89 5.85 6.46.94-4.68 4.56 1.1 6.43L12 17.77l-5.77 3.03 1.1-6.43-4.68-4.56 6.46-.94L12 2.5z"
      />
    </svg>
  )
}

export function IconCreditCard({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path strokeLinecap="round" d="M2 10h20M6 15h4" />
    </svg>
  )
}

export function IconTarget({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconSnowball({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M8 7l4-4 4 4M8 17l4 4 4-4M5 12h14" />
    </svg>
  )
}

export function IconBell({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0a3 3 0 0 1-6 0"
      />
    </svg>
  )
}

export function IconTrash({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M9 7V5h6v2M10 11v6M14 11v6M6 7l1 12h10l1-12" />
    </svg>
  )
}
