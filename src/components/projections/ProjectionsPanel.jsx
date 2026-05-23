import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { projectFinancialOutlook } from '../../intelligence'
import { buildFinancialContext } from '../../intelligence/contextBuilder'
import { ScenarioControls } from './ScenarioControls'
import { ProjectionSummaryCards } from './ProjectionSummaryCards'
import { CashFlowProjectionChart } from './CashFlowProjectionChart'
import { SavingsProjectionChart } from './SavingsProjectionChart'
import { GoalProjectionList } from './GoalProjectionList'
import { HealthProjectionCard } from './HealthProjectionCard'
import { ScenarioImpactCard } from './ScenarioImpactCard'
import { InsightFeed } from '../intelligence/InsightFeed'
import { DebtPayoffChart } from '../debts/DebtPayoffChart'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { SectionHeader } from '../ui/SectionHeader'

export function ProjectionsPanel({ financialData }) {
  const { t, i18n } = useTranslation('projections')
  const [expenseReductionPercent, setExpenseReductionPercent] = useState(0)
  const [savingsBoostPercent, setSavingsBoostPercent] = useState(0)
  const [extraDebtPayment, setExtraDebtPayment] = useState(0)

  const scenarioOptions = useMemo(
    () => ({
      expenseReductionPercent,
      savingsBoostPercent,
      extraDebtPayment,
    }),
    [expenseReductionPercent, savingsBoostPercent, extraDebtPayment],
  )

  const context = useMemo(() => buildFinancialContext(financialData), [financialData])

  const outlook = useMemo(
    () => projectFinancialOutlook(context, scenarioOptions),
    [context, scenarioOptions, i18n.language],
  )

  return (
    <section className="space-y-6">
      <SectionHeader
        variant="violet"
        eyebrow={t('panel.eyebrow')}
        description={t('panel.description')}
      />

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('scenario.title')}</CardTitle>
          </CardHeader>
          <ScenarioControls
            expenseReductionPercent={expenseReductionPercent}
            savingsBoostPercent={savingsBoostPercent}
            extraDebtPayment={extraDebtPayment}
            onExpenseChange={setExpenseReductionPercent}
            onSavingsChange={setSavingsBoostPercent}
            onDebtExtraChange={setExtraDebtPayment}
          />
        </Card>

        <div className="space-y-4 lg:col-span-3">
          <ScenarioImpactCard scenarios={outlook.scenarios} />
        </div>
      </div>

      <ProjectionSummaryCards outlook={outlook} />

      {outlook.insights?.length > 0 ? (
        <InsightFeed insights={outlook.insights} />
      ) : null}

      <section className="grid gap-4 lg:grid-cols-2">
        <CashFlowProjectionChart chartTrend={outlook.chartTrend} />
        <SavingsProjectionChart savingsProjection={outlook.savings?.twelveMonths} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <HealthProjectionCard health={outlook.health} />
        <GoalProjectionList goals={outlook.goals} />
      </section>

      {outlook.debt?.hasDebt ? (
        <DebtPayoffChart
          baselineTimeline={outlook.debt.baseline?.timeline}
          withExtraTimeline={outlook.debt.withExtra?.timeline}
        />
      ) : null}
    </section>
  )
}
