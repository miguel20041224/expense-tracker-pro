import { cn } from '../../utils/cn'
import { Label } from './Label'

export function FormField({ label, htmlFor, error, hint, className, children }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && !error ? (
        <p id={`${htmlFor}-hint`} className="text-xs text-slate-500">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${htmlFor}-error`} className="text-xs text-expense" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

