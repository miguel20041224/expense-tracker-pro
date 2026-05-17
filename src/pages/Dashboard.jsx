import { useState } from 'react'
import { AppShell } from '../components/layout/AppShell'
import { BalanceHero } from '../components/dashboard/BalanceHero'
import { MetricCard } from '../components/dashboard/MetricCard'
import { SavingsProgress } from '../components/dashboard/SavingsProgress'
import { TransactionList } from '../components/dashboard/TransactionList'
import { CategoryBreakdown } from '../components/dashboard/CategoryBreakdown'
import { ExpenseForm } from '../components/expenses/ExpenseForm'
import { IconTrendUp, IconTrendDown, IconPiggyBank } from '../components/icons'
import { categories, summary, transactions as initialTransactions } from '../data/mockFinance'

export default function Dashboard() {
  const [transactions, setTransactions] = useState(initialTransactions)
  const savingsRate = ((summary.savings / summary.income) * 100).toFixed(0)

  function handleAddExpense(expense) {
    setTransactions((prev) => [expense, ...prev])
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <BalanceHero balance={summary.balance} change={summary.balanceChange} />

        <section
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          aria-label="Resumen financiero"
        >
          <MetricCard
            label="Ingresos"
            value={summary.income}
            variant="income"
            icon={<IconTrendUp />}
            subtitle="Incluye nómina y extras"
          />
          <MetricCard
            label="Gastos"
            value={summary.expenses}
            variant="expense"
            icon={<IconTrendDown />}
            subtitle="61% del total de ingresos"
          />
          <MetricCard
            label="Ahorro"
            value={summary.savings}
            variant="savings"
            icon={<IconPiggyBank />}
            subtitle={`${savingsRate}% de tus ingresos`}
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <SavingsProgress current={summary.savings} goal={summary.savingsGoal} />
          </div>
          <div className="lg:col-span-3">
            <CategoryBreakdown categories={categories} />
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <ExpenseForm onSubmit={handleAddExpense} />
          </div>
          <div className="lg:col-span-3">
            <TransactionList transactions={transactions} />
          </div>
        </section>
      </div>
    </AppShell>
  )
}
