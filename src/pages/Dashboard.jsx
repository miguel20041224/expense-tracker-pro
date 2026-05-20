import { useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { AppShell } from '../components/layout/AppShell'
import { BalanceHero } from '../components/dashboard/BalanceHero'
import { AlertCenter } from '../components/intelligence/AlertCenter'
import { AlertStrip } from '../components/intelligence/AlertStrip'
import { ExpenseTrendChart } from '../components/intelligence/ExpenseTrendChart'
import { FinancialHealthScore } from '../components/intelligence/FinancialHealthScore'
import { InsightFeed } from '../components/intelligence/InsightFeed'
import { MetricCard } from '../components/dashboard/MetricCard'
import { SavingsProgress } from '../components/dashboard/SavingsProgress'
import { TransactionList } from '../components/dashboard/TransactionList'
import { MovementsPanel } from '../components/dashboard/MovementsPanel'
import { CategoryBreakdown } from '../components/dashboard/CategoryBreakdown'
import { OnboardingBanner } from '../components/dashboard/OnboardingBanner'
import { CurrencySelector } from '../components/currency/CurrencySelector'
import { ExpenseForm } from '../components/expenses/ExpenseForm'
import { BudgetForm } from '../components/budgets/BudgetForm'
import { BudgetSummary } from '../components/budgets/BudgetSummary'
import { IncomeBudgetSettings } from '../components/budgets/IncomeBudgetSettings'
import { CreditCardsPanel } from '../components/creditCards/CreditCardsPanel'
import { GoalsPanel } from '../components/goals/GoalsPanel'
import { SnowballPanel } from '../components/debts/SnowballPanel'
import { IconTrendUp, IconTrendDown, IconPiggyBank, IconWallet } from '../components/icons'
import { useTransactions } from '../hooks/useTransactions'
import { useIncomeBudget } from '../hooks/useIncomeBudget'
import { useCreditCards } from '../hooks/useCreditCards'
import { useFinancialGoals } from '../hooks/useFinancialGoals'
import { useDebts } from '../hooks/useDebts'
import { useMovementActions } from '../hooks/useMovementActions'
import { MovementActionsLayer } from '../components/movements/MovementActionsLayer'
import { useOnboarding } from '../hooks/useOnboarding'
import { useIntelligenceCache } from '../hooks/useIntelligenceCache'
import { computeSummary, computeCategories, hasBudgetData } from '../utils/finance'
import { runFinancialAnalysis, filterActiveAlerts } from '../intelligence'

export default function Dashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('inicio')
  const {
    transactions,
    addExpense,
    addBudget,
    updateTransaction,
    deleteTransaction,
    toggleFavorite,
    isEmpty,
  } = useTransactions(user)
  const { income, overview: budgetOverview, saveIncome, loading: incomeLoading } =
    useIncomeBudget(user)
  const { cards, addCard, deleteCard } = useCreditCards(user)
  const { goals, addGoal, deleteGoal, contributeToGoal, applyIncomeContributions } =
    useFinancialGoals(user)
  const { debts, addDebt, deleteDebt } = useDebts(user)
  const {
    editingTransaction,
    deletingTransaction,
    closeEdit,
    closeDelete,
    handleSaveEdit,
    handleConfirmDelete,
    movementHandlers,
  } = useMovementActions({ updateTransaction, deleteTransaction })
  const { showOnboarding, dismissOnboarding } = useOnboarding(isEmpty)
  const { cache, dismissAlert, restoreAlert, dismissAll, markAlertsSeen } =
    useIntelligenceCache(user)
  const expenseFormRef = useRef(null)

  const summary = useMemo(() => computeSummary(transactions, income), [transactions, income])
  const categories = useMemo(() => computeCategories(transactions), [transactions])

  const analysis = useMemo(
    () =>
      runFinancialAnalysis({
        transactions,
        creditCards: cards,
        goals,
        debts,
        income,
      }),
    [transactions, cards, goals, debts, income],
  )

  const activeAlerts = useMemo(
    () => filterActiveAlerts(analysis.alerts, cache.dismissedAlerts),
    [analysis.alerts, cache.dismissedAlerts],
  )

  useEffect(() => {
    if (activeTab === 'alertas') {
      markAlertsSeen()
    }
  }, [activeTab, markAlertsSeen])

  const expenseShare =
    summary.income > 0
      ? `${Math.round((summary.expenses / summary.income) * 100)}% de tus ingresos`
      : null

  const savingsRate =
    summary.income > 0
      ? `${Math.round((Math.max(summary.savings, 0) / summary.income) * 100)}% disponible`
      : null

  function scrollToExpenseForm() {
    setActiveTab('inicio')
    window.requestAnimationFrame(() => {
      expenseFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      const firstInput = expenseFormRef.current?.querySelector('input, select')
      firstInput?.focus()
    })
  }

  function handleAddExpense(expense) {
    addExpense(expense)
  }

  function handleAddBudget(budget) {
    const transaction = addBudget(budget)
    applyIncomeContributions(Math.abs(transaction?.amount ?? budget.amount))
    setActiveTab('movimientos')
  }

  function handleAddCardExpense(expense) {
    addExpense(expense)
  }

  const cardNameById = useMemo(() => {
    const map = new Map()
    for (const card of cards) map.set(card.id, card.name)
    return map
  }, [cards])

  return (
    <AppShell activeTab={activeTab} onTabChange={setActiveTab} alertCount={activeAlerts.length}>
      <div className="space-y-6">
        <div className="flex justify-end">
          <CurrencySelector className="w-full sm:w-auto" />
        </div>

        {activeTab === 'inicio' ? (
          <>
            {showOnboarding ? (
              <OnboardingBanner
                onGetStarted={scrollToExpenseForm}
                onDismiss={dismissOnboarding}
              />
            ) : null}

            <FinancialHealthScore health={analysis.health} />
            <AlertStrip
              alerts={activeAlerts}
              onViewAll={() => setActiveTab('alertas')}
            />
            <InsightFeed insights={analysis.insights} />

            <section className="grid gap-4 lg:grid-cols-2">
              <ExpenseTrendChart trend={analysis.trend} />
              <CategoryBreakdown categories={categories} />
            </section>

            <BalanceHero summary={summary} />

            <section
              className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
              aria-label="Resumen financiero"
            >
              <MetricCard
                label="Ingresos"
                value={summary.income}
                variant="income"
                icon={<IconTrendUp />}
                isEmpty={!summary.hasBudgets}
                emptyHint="Agrega presupuesto en la pestaña Presupuesto"
                subtitle={
                  summary.income > 0
                    ? `${summary.budgets > 0 ? 'Presupuestos del mes' : 'Ingresos del mes'}`
                    : undefined
                }
              />
              <MetricCard
                label="Gastos"
                value={summary.expenses}
                variant="expense"
                icon={<IconTrendDown />}
                isEmpty={!summary.hasExpenses}
                emptyHint="Tus gastos aparecerán aquí al registrarlos"
                subtitle={expenseShare ?? (summary.expenses > 0 ? 'Total del mes actual' : undefined)}
              />
              <MetricCard
                label="Ahorro"
                value={summary.savings}
                variant="savings"
                icon={<IconPiggyBank />}
                isEmpty={!summary.hasActivity}
                emptyHint="Disponible = presupuestos − gastos"
                subtitle={
                  summary.isOverBudget
                    ? 'Presupuesto superado este mes'
                    : savingsRate ?? (summary.savings > 0 ? 'Saldo disponible del mes' : undefined)
                }
              />
              <MetricCard
                label="Balance total"
                value={summary.balance}
                variant="balance"
                icon={<IconWallet />}
                isEmpty={!summary.hasActivity}
                emptyHint="Se calcula con tus movimientos del mes"
                subtitle={
                  summary.hasActivity
                    ? 'Presupuestos − gastos'
                    : undefined
                }
              />
            </section>

            {hasBudgetData(transactions, income) ? (
              <SavingsProgress
                income={summary.income}
                expenses={summary.expenses}
                remaining={summary.savings}
                isOverBudget={summary.isOverBudget}
              />
            ) : null}

            <section className="grid gap-4 lg:grid-cols-5">
              <div ref={expenseFormRef} id="add-expense" className="scroll-mt-6 lg:col-span-2">
                <ExpenseForm onSubmit={handleAddExpense} creditCards={cards} />
              </div>
              <section className="lg:col-span-3">
                <TransactionList
                  transactions={transactions}
                  isEmpty={isEmpty}
                  limit={5}
                  onEdit={movementHandlers.onEdit}
                  onDelete={movementHandlers.onDelete}
                  onToggleFavorite={toggleFavorite}
                  creditCardNames={cardNameById}
                />
              </section>
            </section>
          </>
        ) : null}

        {activeTab === 'alertas' ? (
          <AlertCenter
            activeAlerts={activeAlerts}
            allAlerts={analysis.alerts}
            dismissedAlerts={cache.dismissedAlerts}
            onDismiss={dismissAlert}
            onRestore={restoreAlert}
            onDismissAll={dismissAll}
          />
        ) : null}

        {activeTab === 'movimientos' ? (
          <MovementsPanel
            transactions={transactions}
            isEmpty={isEmpty}
            onEdit={movementHandlers.onEdit}
            onDelete={movementHandlers.onDelete}
            onToggleFavorite={toggleFavorite}
            creditCardNames={cardNameById}
          />
        ) : null}

        {activeTab === 'presupuesto' ? (
          <section className="grid gap-4 lg:grid-cols-5">
            <div className="space-y-4 lg:col-span-2">
              <IncomeBudgetSettings
                income={income}
                overview={budgetOverview}
                onSave={saveIncome}
                loading={incomeLoading}
              />
              <BudgetForm onSubmit={handleAddBudget} />
            </div>
            <section className="space-y-4 lg:col-span-3">
              <BudgetSummary
                transactions={transactions}
                income={income}
                overview={budgetOverview}
              />
            </section>
          </section>
        ) : null}

        {activeTab === 'tarjetas' ? (
          <CreditCardsPanel
            cards={cards}
            transactions={transactions}
            onAddCard={addCard}
            onDeleteCard={deleteCard}
            onAddCardExpense={handleAddCardExpense}
          />
        ) : null}

        {activeTab === 'metas' ? (
          <GoalsPanel
            goals={goals}
            onAddGoal={addGoal}
            onContribute={contributeToGoal}
            onDeleteGoal={deleteGoal}
          />
        ) : null}

        {activeTab === 'deudas' ? (
          <SnowballPanel debts={debts} onAddDebt={addDebt} onDeleteDebt={deleteDebt} />
        ) : null}

      </div>
      <MovementActionsLayer
        editingTransaction={editingTransaction}
        deletingTransaction={deletingTransaction}
        onCloseEdit={closeEdit}
        onCloseDelete={closeDelete}
        onSaveEdit={handleSaveEdit}
        onConfirmDelete={handleConfirmDelete}
        creditCards={cards}
      />
    </AppShell>
  )
}
