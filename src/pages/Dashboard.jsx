import { lazy, Suspense, useCallback, useEffect, useMemo, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { AppShell } from '../components/layout/AppShell'
import { BalanceHero } from '../components/dashboard/BalanceHero'
import { AlertStrip } from '../components/intelligence/AlertStrip'
import { ExpenseTrendChart } from '../components/intelligence/ExpenseTrendChart'
import { FinancialHealthScore } from '../components/intelligence/FinancialHealthScore'
import { InsightFeed } from '../components/intelligence/InsightFeed'
import { MetricCard } from '../components/dashboard/MetricCard'
import { SavingsProgress } from '../components/dashboard/SavingsProgress'
import { TransactionList } from '../components/dashboard/TransactionList'
import { CategoryBreakdown } from '../components/dashboard/CategoryBreakdown'
import { OnboardingBanner } from '../components/dashboard/OnboardingBanner'
import { CurrencySelector } from '../components/currency/CurrencySelector'
import { ExpenseForm } from '../components/expenses/ExpenseForm'
import { ReportErrorBoundary } from '../components/ui/ReportErrorBoundary'
import { PanelFallback } from '../components/ui/PanelFallback'
import { TabPanel } from '../components/ui/TabPanel'
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
import { useFinancialAnalysis } from '../hooks/useFinancialAnalysis'
import { useStableFinancialData } from '../hooks/useStableFinancialData'
import { useAppTab } from '../hooks/useAppTab'
import { computeSummary, computeCategories, hasBudgetData } from '../utils/finance'

const ReportsPanel = lazy(() =>
  import('../components/reports/ReportsPanel').then((m) => ({ default: m.ReportsPanel })),
)
const ProjectionsPanel = lazy(() =>
  import('../components/projections/ProjectionsPanel').then((m) => ({ default: m.ProjectionsPanel })),
)
const AlertCenter = lazy(() =>
  import('../components/intelligence/AlertCenter').then((m) => ({ default: m.AlertCenter })),
)
const MovementsPanel = lazy(() =>
  import('../components/dashboard/MovementsPanel').then((m) => ({ default: m.MovementsPanel })),
)
const BudgetTab = lazy(() =>
  import('../components/dashboard/BudgetTab').then((m) => ({ default: m.BudgetTab })),
)
const CreditCardsPanel = lazy(() =>
  import('../components/creditCards/CreditCardsPanel').then((m) => ({ default: m.CreditCardsPanel })),
)
const GoalsPanel = lazy(() =>
  import('../components/goals/GoalsPanel').then((m) => ({ default: m.GoalsPanel })),
)
const SnowballPanel = lazy(() =>
  import('../components/debts/SnowballPanel').then((m) => ({ default: m.SnowballPanel })),
)

export default function Dashboard() {
  const { user } = useAuth()
  const { activeTab, setActiveTab } = useAppTab()
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

  const financialData = useStableFinancialData({
    transactions,
    creditCards: cards,
    goals,
    debts,
    income,
  })

  const { analysis, activeAlerts } = useFinancialAnalysis(financialData, cache.dismissedAlerts)

  const summary = useMemo(() => computeSummary(transactions, income), [transactions, income])
  const categories = useMemo(() => computeCategories(transactions), [transactions])

  useEffect(() => {
    if (activeTab === 'alertas') {
      markAlertsSeen()
    }
  }, [activeTab, markAlertsSeen])

  const expenseShare = useMemo(() => {
    if (summary.income <= 0) return null
    return `${Math.round((summary.expenses / summary.income) * 100)}% de tus ingresos`
  }, [summary.income, summary.expenses])

  const savingsRate = useMemo(() => {
    if (summary.income <= 0) return null
    return `${Math.round((Math.max(summary.savings, 0) / summary.income) * 100)}% disponible`
  }, [summary.income, summary.savings])

  const scrollToExpenseForm = useCallback(() => {
    setActiveTab('inicio')
    window.requestAnimationFrame(() => {
      expenseFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      const firstInput = expenseFormRef.current?.querySelector('input, select')
      firstInput?.focus()
    })
  }, [setActiveTab])

  const handleAddExpense = useCallback((expense) => {
    addExpense(expense)
  }, [addExpense])

  const handleAddBudget = useCallback(
    (budget) => {
      const transaction = addBudget(budget)
      applyIncomeContributions(Math.abs(transaction?.amount ?? budget.amount))
      setActiveTab('movimientos')
    },
    [addBudget, applyIncomeContributions, setActiveTab],
  )

  const handleAddCardExpense = useCallback(
    (expense) => {
      addExpense(expense)
    },
    [addExpense],
  )

  const cardNameById = useMemo(() => {
    const map = new Map()
    for (const card of cards) map.set(card.id, card.name)
    return map
  }, [cards])

  const goToAlerts = useCallback(() => setActiveTab('alertas'), [setActiveTab])

  return (
    <AppShell activeTab={activeTab} onTabChange={setActiveTab} alertCount={activeAlerts.length}>
      <div className="space-y-6">
        <div className="flex justify-end">
          <CurrencySelector className="w-full sm:w-auto" />
        </div>

        <TabPanel tabId="inicio" activeTab={activeTab}>
          {showOnboarding ? (
            <OnboardingBanner onGetStarted={scrollToExpenseForm} onDismiss={dismissOnboarding} />
          ) : null}

          <FinancialHealthScore health={analysis.health} />
          <AlertStrip alerts={activeAlerts} onViewAll={goToAlerts} />
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
              subtitle={
                expenseShare ?? (summary.expenses > 0 ? 'Total del mes actual' : undefined)
              }
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
              subtitle={summary.hasActivity ? 'Presupuestos − gastos' : undefined}
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
        </TabPanel>

        <TabPanel tabId="alertas" activeTab={activeTab}>
          <Suspense fallback={<PanelFallback label="Cargando alertas…" />}>
            <AlertCenter
              activeAlerts={activeAlerts}
              allAlerts={analysis.alerts}
              dismissedAlerts={cache.dismissedAlerts}
              onDismiss={dismissAlert}
              onRestore={restoreAlert}
              onDismissAll={dismissAll}
            />
          </Suspense>
        </TabPanel>

        <TabPanel tabId="movimientos" activeTab={activeTab}>
          <Suspense fallback={<PanelFallback label="Cargando movimientos…" />}>
            <MovementsPanel
              transactions={transactions}
              isEmpty={isEmpty}
              onEdit={movementHandlers.onEdit}
              onDelete={movementHandlers.onDelete}
              onToggleFavorite={toggleFavorite}
              creditCardNames={cardNameById}
            />
          </Suspense>
        </TabPanel>

        <TabPanel tabId="presupuesto" activeTab={activeTab}>
          <Suspense fallback={<PanelFallback label="Cargando presupuesto…" />}>
            <BudgetTab
              transactions={transactions}
              income={income}
              budgetOverview={budgetOverview}
              saveIncome={saveIncome}
              incomeLoading={incomeLoading}
              onAddBudget={handleAddBudget}
            />
          </Suspense>
        </TabPanel>

        <TabPanel tabId="tarjetas" activeTab={activeTab}>
          <Suspense fallback={<PanelFallback label="Cargando tarjetas…" />}>
            <CreditCardsPanel
              cards={cards}
              transactions={transactions}
              onAddCard={addCard}
              onDeleteCard={deleteCard}
              onAddCardExpense={handleAddCardExpense}
            />
          </Suspense>
        </TabPanel>

        <TabPanel tabId="metas" activeTab={activeTab}>
          <Suspense fallback={<PanelFallback label="Cargando metas…" />}>
            <GoalsPanel
              goals={goals}
              onAddGoal={addGoal}
              onContribute={contributeToGoal}
              onDeleteGoal={deleteGoal}
            />
          </Suspense>
        </TabPanel>

        <TabPanel tabId="deudas" activeTab={activeTab}>
          <Suspense fallback={<PanelFallback label="Cargando deudas…" />}>
            <SnowballPanel debts={debts} onAddDebt={addDebt} onDeleteDebt={deleteDebt} />
          </Suspense>
        </TabPanel>

        <TabPanel tabId="proyecciones" activeTab={activeTab}>
          <Suspense fallback={<PanelFallback label="Cargando proyecciones…" />}>
            <ProjectionsPanel financialData={financialData} />
          </Suspense>
        </TabPanel>

        <TabPanel tabId="reportes" activeTab={activeTab}>
          <ReportErrorBoundary>
            <Suspense fallback={<PanelFallback label="Cargando reportes…" />}>
              <ReportsPanel financialData={financialData} userName={user?.name} />
            </Suspense>
          </ReportErrorBoundary>
        </TabPanel>
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
