import { cn } from '../../utils/cn'
import { Label } from './Label'

export function FormField({ label, htmlFor, error, className, children }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="text-xs text-expense" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
