import { BudgetForm } from '../budgets/BudgetForm'
import { BudgetSummary } from '../budgets/BudgetSummary'
import { IncomeBudgetSettings } from '../budgets/IncomeBudgetSettings'

export function BudgetTab({
  transactions,
  income,
  budgetOverview,
  saveIncome,
  incomeLoading,
  onAddBudget,
}) {
  return (
    <section className="grid gap-4 lg:grid-cols-5">
      <div className="space-y-4 lg:col-span-2">
        <IncomeBudgetSettings
          income={income}
          overview={budgetOverview}
          onSave={saveIncome}
          loading={incomeLoading}
        />
        <BudgetForm onSubmit={onAddBudget} />
      </div>
      <section className="space-y-4 lg:col-span-3">
        <BudgetSummary transactions={transactions} income={income} overview={budgetOverview} />
      </section>
    </section>
  )
}
