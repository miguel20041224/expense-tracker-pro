import { useTranslation } from 'react-i18next'
import { Card } from '../ui/Card'
import { cn } from '../../utils/cn'

const ringColors = {
  emerald: 'stroke-emerald-400',
  sky: 'stroke-sky-400',
  amber: 'stroke-amber-400',
  rose: 'stroke-rose-400',
}

const labelColors = {
  emerald: 'text-emerald-400',
  sky: 'text-sky-400',
  amber: 'text-amber-400',
  rose: 'text-rose-400',
}

export function FinancialHealthScore({ health }) {
  const { t } = useTranslation('dashboard')

  if (!health) return null

  const { score, level, levelColor, recommendations } = health
  const levelLabel = t(`health.levels.${level}`, { defaultValue: health.levelLabel })
  const circumference = 2 * Math.PI * 42
  const offset = circumference - (score / 100) * circumference
  const ring = ringColors[levelColor] ?? ringColors.sky
  const label = labelColors[levelColor] ?? labelColors.sky

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="relative mx-auto size-32 shrink-0 sm:mx-0">
          <svg className="size-full -rotate-90" viewBox="0 0 100 100" aria-hidden>
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              className="stroke-white/10"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              className={cn(ring, 'transition-all duration-700')}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-semibold tabular-nums text-white">{score}</span>
            <span className="text-[10px] font-medium tracking-wider text-slate-500 uppercase">
              {t('health.scoreOutOf')}
            </span>
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <p className="text-xs font-medium tracking-widest text-slate-500 uppercase">
              {t('health.title')}
            </p>
            <p className={cn('mt-1 text-xl font-semibold', label)}>{levelLabel}</p>
          </div>
          {recommendations?.length ? (
            <ul className="space-y-1.5 text-sm text-slate-400">
              {recommendations.map((rec) => {
                const id = typeof rec === 'string' ? rec : rec.id
                const fallback = typeof rec === 'string' ? rec : rec.text
                return (
                  <li key={id} className="flex gap-2">
                    <span className="text-accent" aria-hidden>
                      ·
                    </span>
                    <span>
                      {t(`health.recommendations.${id}`, {
                        defaultValue: fallback,
                        ...(typeof rec === 'object' ? rec.params : {}),
                      })}
                    </span>
                  </li>
                )
              })}
            </ul>
          ) : null}
        </div>
      </div>
    </Card>
  )
}
