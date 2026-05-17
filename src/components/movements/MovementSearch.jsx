import { Input } from '../ui/Input'
import { IconSearch, IconX } from '../icons'
import { cn } from '../../utils/cn'

export function MovementSearch({ value, onChange, className }) {
  return (
    <div className={cn('relative', className)}>
      <IconSearch className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-500" />
      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar por nombre o categoría…"
        className="pl-10 pr-10"
        aria-label="Buscar movimientos"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-0.5 text-slate-500 transition hover:bg-white/5 hover:text-slate-300"
          aria-label="Limpiar búsqueda"
        >
          <IconX className="size-4" />
        </button>
      ) : null}
    </div>
  )
}
