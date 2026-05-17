import { cn } from '../../utils/cn'

export function Label({ className, children, ...props }) {
  return (
    <label
      className={cn('block text-sm font-medium text-slate-300', className)}
      {...props}
    >
      {children}
    </label>
  )
}
