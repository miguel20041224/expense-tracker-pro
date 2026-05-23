import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { cn } from '../../utils/cn'
import { useIntelligenceMessage } from '../../i18n/useIntelligenceMessage'

const typeStyles = {
  danger: 'border-rose-500/30 bg-rose-500/10 text-rose-200',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
  info: 'border-sky-500/30 bg-sky-500/10 text-sky-200',
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
}

function InsightFeedInner({ insights }) {
  const { t } = useTranslation(['dashboard', 'common'])
  const localize = useIntelligenceMessage()

  if (!insights?.length) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('insights.title', { ns: 'dashboard' })}</CardTitle>
        <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">
          {t('copilot')}
        </span>
      </CardHeader>
      <ul className="space-y-2">
        {insights.map((item) => (
          <li
            key={item.id}
            className={cn(
              'rounded-xl border px-3 py-2.5 text-sm leading-relaxed',
              typeStyles[item.type] ?? typeStyles.info,
            )}
          >
            <div className="flex flex-wrap items-start gap-2">
              {item.category ? (
                <span className="shrink-0 rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-slate-400 uppercase">
                  {t(`categories.${item.category}`, { ns: 'common', defaultValue: item.category })}
                </span>
              ) : null}
              <span className="min-w-0 flex-1">{localize(item)}</span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export const InsightFeed = memo(InsightFeedInner)
