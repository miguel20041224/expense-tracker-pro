import { memo } from 'react'
import { ResponsiveContainer } from 'recharts'
import { cn } from '../../utils/cn'

function ChartShellInner({ height = 224, className, children }) {
  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  )
}

export const ChartShell = memo(ChartShellInner)
