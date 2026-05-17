import { MovementItem } from '../dashboard/MovementItem'
import { cn } from '../../utils/cn'

export function MovementsTimeline({ movements, className }) {
  if (movements.length === 0) return null

  return (
    <ul
      className={cn(
        'relative ml-1 border-l border-border-subtle pb-1',
        className,
      )}
    >
      {movements.map((transaction) => (
        <MovementItem
          key={transaction.id}
          transaction={transaction}
          showTimeline
          className="last:pb-0"
        />
      ))}
    </ul>
  )
}
