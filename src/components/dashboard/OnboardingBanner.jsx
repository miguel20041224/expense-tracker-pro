import { useTranslation } from 'react-i18next'
import { Button } from '../ui/Button'
import { IconWallet, IconChart, IconTrendDown } from '../icons'
import { cn } from '../../utils/cn'

const stepKeys = ['trackExpenses', 'viewSummary', 'controlMoney']
const stepIcons = [IconTrendDown, IconChart, IconWallet]

export function OnboardingBanner({ onGetStarted, onDismiss }) {
  const { t } = useTranslation('dashboard')

  return (
    <section
      className="relative overflow-hidden rounded-3xl border border-accent/20 bg-linear-to-br from-accent-muted/60 via-surface-card to-surface-card p-6 sm:p-8"
      aria-label={t('onboarding.ariaLabel')}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-accent/15 blur-2xl" aria-hidden />

      <div className="relative space-y-6">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">{t('onboarding.welcome')}</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
            {t('onboarding.title')}
          </h2>
          <p className="mt-2 text-sm text-slate-400">{t('onboarding.description')}</p>
        </div>

        <ol className="grid gap-3 sm:grid-cols-3">
          {stepKeys.map((key, index) => {
            const Icon = stepIcons[index]
            return (
              <li
                key={key}
                className={cn(
                  'flex gap-3 rounded-2xl border border-border-subtle bg-white/3 p-4',
                )}
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-sm font-semibold text-accent">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <div className="mb-2 text-accent">
                    <Icon className="size-4" />
                  </div>
                  <p className="text-sm font-medium text-slate-200">{t(`onboarding.steps.${key}.title`)}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{t(`onboarding.steps.${key}.description`)}</p>
                </div>
              </li>
            )
          })}
        </ol>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
          <Button type="button" variant="secondary" onClick={onDismiss} className="sm:mr-auto">
            {t('onboarding.skip')}
          </Button>
          <Button type="button" size="lg" onClick={onGetStarted}>
            {t('onboarding.cta')}
          </Button>
        </div>
      </div>
    </section>
  )
}
