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

export function IconArrowRight({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}
