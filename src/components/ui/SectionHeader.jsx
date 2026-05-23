import { cn } from '../../utils/cn'

const variants = {
  accent: {
    box: 'border-accent/15 from-accent/8',
    eyebrow: 'text-accent/90',
  },
  violet: {
    box: 'border-violet-500/15 from-violet-500/8',
    eyebrow: 'text-violet-400/90',
  },
  emerald: {
    box: 'border-emerald-500/15 from-emerald-500/8',
    eyebrow: 'text-emerald-400/90',
  },
}

export function SectionHeader({ eyebrow, title, description, variant = 'accent', className }) {
  const v = variants[variant] ?? variants.accent

  return (
    <header
      className={cn(
        'rounded-2xl border bg-linear-to-br via-surface-card/60 to-surface-card/60 p-5 motion-safe:animate-fade-in-up',
        v.box,
        className,
      )}
    >
      {eyebrow ? (
        <p className={cn('text-xs font-medium tracking-widest uppercase', v.eyebrow)}>{eyebrow}</p>
      ) : null}
      {title ? <h2 className="mt-1 text-base font-semibold tracking-tight text-white">{title}</h2> : null}
      {description ? (
        <p className="mt-2 text-sm leading-relaxed text-slate-400">{description}</p>
      ) : null}
    </header>
  )
}
