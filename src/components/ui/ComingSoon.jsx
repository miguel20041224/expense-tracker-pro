import { EmptyState } from './EmptyState'
import { IconPiggyBank } from '../icons'

export function ComingSoon({ title, description }) {
  return (
    <section className="flex min-h-[320px] items-center justify-center rounded-3xl border border-border-subtle bg-surface-card/50 p-8 motion-safe:animate-fade-in-up">
      <EmptyState
        icon={<IconPiggyBank className="size-6" />}
        title={title}
        description={description}
      />
    </section>
  )
}
