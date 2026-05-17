import { useMemo, useRef } from 'react'
import { AppShell } from '../components/layout/AppShell'
import { BalanceHero } from '../components/dashboard/BalanceHero'
import { MetricCard } from '../components/dashboard/MetricCard'
import { SavingsProgress } from '../components/dashboard/SavingsProgress'
import { TransactionList } from '../components/dashboard/TransactionList'
import { CategoryBreakdown } from '../components/dashboard/CategoryBreakdown'
import { OnboardingBanner } from '../components/dashboard/OnboardingBanner'
import { CurrencySelector } from '../components/currency/CurrencySelector'
import { ExpenseForm } from '../components/expenses/ExpenseForm'
import { IconTrendUp, IconTrendDown, IconPiggyBank } from '../components/icons'
import { useTransactions } from '../hooks/useTransactions'
import { useOnboarding } from '../hooks/useOnboarding'
import {
  computeSummary,
  computeCategories,
  hasExpenseData,
  hasSavingsData,
} from '../utils/finance'

export default function Dashboard() {
  const { transactions, addTransaction, isEmpty } = useTransactions()
  const { showOnboarding, dismissOnboarding } = useOnboarding(isEmpty)
  const expenseFormRef = useRef(null)

  const summary = useMemo(() => computeSummary(transactions), [transactions])
  const categories = useMemo(() => computeCategories(transactions), [transactions])
  const showCategories = hasExpenseData(transactions)
  const showSavings = hasSavingsData(summary) && summary.savingsGoal > 0

  const expenseShare =
    summary.income > 0 ? `${Math.round((summary.expenses / summary.income) * 100)}% del total de ingresos` : null
  const savingsRate =
    summary.income > 0 ? `${Math.round((summary.savings / summary.income) * 100)}% de tus ingresos` : null

  function scrollToExpenseForm() {
    expenseFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    const firstInput = expenseFormRef.current?.querySelector('input, select')
    firstInput?.focus()
  }

  function handleAddExpense(expense) {
    addTransaction(expense)
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex justify-end">
          <CurrencySelector className="w-full sm:w-auto" />
        </div>

        {showOnboarding ? (
          <OnboardingBanner
            onGetStarted={scrollToExpenseForm}
            onDismiss={dismissOnboarding}
          />
        ) : null}

        <BalanceHero balance={summary.balance} isEmpty={isEmpty} />

        <section
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          aria-label="Resumen financiero"
        >
          <MetricCard
            label="Ingresos"
            value={summary.income}
            variant="income"
            icon={<IconTrendUp />}
            isEmpty={isEmpty || summary.income === 0}
            emptyHint="Sin ingresos registrados este mes"
            subtitle={summary.income > 0 ? 'Total del mes actual' : undefined}
          />
          <MetricCard
            label="Gastos"
            value={summary.expenses}
            variant="expense"
            icon={<IconTrendDown />}
            isEmpty={isEmpty || summary.expenses === 0}
            emptyHint="Tus gastos aparecerán aquí"
            subtitle={expenseShare ?? (summary.expenses > 0 ? 'Total del mes actual' : undefined)}
          />
          <MetricCard
            label="Ahorro"
            value={summary.savings}
            variant="savings"
            icon={<IconPiggyBank />}
            isEmpty={isEmpty || (summary.income === 0 && summary.savings === 0)}
            emptyHint="Registra ingresos para calcular ahorro"
            subtitle={savingsRate ?? (summary.savings > 0 ? 'Disponible este mes' : undefined)}
          />
        </section>

        {(showSavings || showCategories) && (
          <section className="grid gap-4 lg:grid-cols-5">
            {showSavings ? (
              <div className="lg:col-span-2">
                <SavingsProgress current={summary.savings} goal={summary.savingsGoal} />
              </div>
            ) : null}
            {showCategories ? (
              <div className={showSavings ? 'lg:col-span-3' : 'lg:col-span-5'}>
                <CategoryBreakdown categories={categories} />
              </div>
            ) : null}
          </section>
        )}

        <section className="grid gap-4 lg:grid-cols-5">
          <div ref={expenseFormRef} id="add-expense" className="scroll-mt-6 lg:col-span-2">
            <ExpenseForm onSubmit={handleAddExpense} />
          </div>
          <div className="lg:col-span-3">
            <TransactionList transactions={transactions} isEmpty={isEmpty} />
          </div>
        </section>
      </div>
    </AppShell>
  )
}
