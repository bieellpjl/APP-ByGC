import { useState } from 'react'
import { useFinance } from './hooks/useFinance'
import { useTheme } from './hooks/useTheme'
import Header from './components/Header'
import BalanceCard from './components/BalanceCard'
import CategoryChart from './components/CategoryChart'
import MonthlyChart from './components/MonthlyChart'
import TransactionList from './components/TransactionList'
import TransactionForm from './components/TransactionForm'
import PeriodFilter from './components/PeriodFilter'
import SavingsGoals from './components/SavingsGoals'
import SavingsGoalForm from './components/SavingsGoalForm'
import RecentTransactions from './components/RecentTransactions'
import InsightsPanel from './components/InsightsPanel'
import Modal from './components/Modal'
import { formatCurrency, formatPeriodLabel } from './utils/format'
import './App.css'

export default function App() {
  const finance = useFinance()
  const { isDark, toggleTheme } = useTheme()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTx, setEditingTx] = useState(null)
  const [goalModalOpen, setGoalModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  const openAdd = () => {
    setEditingTx(null)
    setModalOpen(true)
  }

  const openEdit = (tx) => {
    setEditingTx(tx)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingTx(null)
  }

  const openAddGoal = () => {
    setEditingGoal(null)
    setGoalModalOpen(true)
  }

  const openEditGoal = (goal) => {
    setEditingGoal(goal)
    setGoalModalOpen(true)
  }

  const closeGoalModal = () => {
    setGoalModalOpen(false)
    setEditingGoal(null)
  }

  const handleSubmit = (data) => {
    if (editingTx) {
      finance.updateTransaction(editingTx.id, data)
    } else {
      finance.addTransaction(data)
    }
    closeModal()
  }

  const handleGoalSubmit = (data) => {
    if (editingGoal) {
      finance.updateSavingsGoal(editingGoal.id, data)
    } else {
      finance.addSavingsGoal(data)
    }
    closeGoalModal()
  }

  const handleGoalDelete = () => {
    if (window.confirm('Deseja excluir esta meta?')) {
      finance.deleteSavingsGoal(editingGoal.id)
      closeGoalModal()
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('Deseja excluir esta transação?')) {
      finance.deleteTransaction(id)
    }
  }

  const savingsRate =
    finance.stats.income > 0
      ? ((finance.stats.balance / finance.stats.income) * 100).toFixed(0)
      : 0

  return (
    <div className="app">
      <div className="app__bg" aria-hidden="true" />

      <Header onAddClick={openAdd} isDark={isDark} onThemeToggle={toggleTheme} />

      <nav className="tabs">
        {[
          { id: 'overview', label: 'Visão Geral', icon: '📊' },
          { id: 'transactions', label: 'Transações', icon: '📋' },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="main">
        {activeTab === 'overview' && (
          <>
            <PeriodFilter period={finance.period} onChange={finance.setPeriod} />

            <section className="cards-grid">
              <BalanceCard
                label="Saldo do Período"
                value={finance.stats.balance}
                variant="balance"
                icon="💎"
                trend={finance.stats.balance >= 0 ? 'Situação positiva' : 'Atenção ao déficit'}
              />
              <BalanceCard
                label="Receitas"
                value={finance.stats.income}
                variant="income"
                icon="📈"
              />
              <BalanceCard
                label="Despesas"
                value={finance.stats.expense}
                variant="expense"
                icon="📉"
              />
            </section>

            <div className="overview-grid overview-grid--insights">
              <div className="panel">
                <div className="panel__header">
                  <h3>Alertas & Insights</h3>
                  <span className="panel__badge">{formatPeriodLabel(finance.period)}</span>
                </div>
                <InsightsPanel insights={finance.insights} />
              </div>

              <RecentTransactions
                transactions={finance.recentTransactions}
                onViewAll={() => setActiveTab('transactions')}
              />
            </div>

            <div className="overview-section">
              <SavingsGoals
                goals={finance.savingsGoals}
                onAddClick={openAddGoal}
                onEditClick={openEditGoal}
              />
            </div>

            <div className="overview-grid">
              <div className="panel">
                <div className="panel__header">
                  <h3>Despesas por Categoria</h3>
                  <span className="panel__badge">
                    {finance.categoryBreakdown.length} categorias
                  </span>
                </div>
                <CategoryChart data={finance.categoryBreakdown} />
              </div>

              <div className="panel">
                <div className="panel__header">
                  <h3>Histórico Mensal</h3>
                  <span className="panel__badge">Últimos 6 meses</span>
                </div>
                <MonthlyChart data={finance.monthlyData} />
              </div>
            </div>

            <div className="insight-bar">
              <span className="insight-bar__icon">💡</span>
              <p>
                Taxa de economia em {formatPeriodLabel(finance.period)}:{' '}
                <strong>{savingsRate}%</strong> das receitas —
                você {finance.stats.balance >= 0 ? 'economizou' : 'gastou além de'}{' '}
                <strong>{formatCurrency(Math.abs(finance.stats.balance))}</strong>
              </p>
            </div>
          </>
        )}

        {activeTab === 'transactions' && (
          <section className="transactions-section">
            <div className="toolbar">
              <div className="search-box">
                <span>🔎</span>
                <input
                  type="text"
                  placeholder="Buscar transações..."
                  value={finance.search}
                  onChange={(e) => finance.setSearch(e.target.value)}
                />
              </div>
              <div className="filter-group">
                {[
                  { id: 'all', label: 'Todas' },
                  { id: 'income', label: 'Receitas' },
                  { id: 'expense', label: 'Despesas' },
                ].map((f) => (
                  <button
                    key={f.id}
                    className={`filter-btn ${finance.filter === f.id ? 'filter-btn--active' : ''}`}
                    onClick={() => finance.setFilter(f.id)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="panel">
              <div className="panel__header">
                <h3>
                  {finance.filteredTransactions.length} transação
                  {finance.filteredTransactions.length !== 1 ? 'ões' : ''}
                </h3>
              </div>
              <TransactionList
                transactions={finance.filteredTransactions}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <div className="footer__brand">
          <strong>ByGC</strong>
          <span>Finanças pessoais</span>
        </div>
        <p className="footer__devs">
          Desenvolvido por <strong>Gabriel</strong> e <strong>Caio</strong>
        </p>
      </footer>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingTx ? 'Editar Transação' : 'Nova Transação'}
      >
        <TransactionForm
          key={editingTx?.id || 'new'}
          initial={editingTx}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </Modal>

      <Modal
        open={goalModalOpen}
        onClose={closeGoalModal}
        title={editingGoal ? 'Editar Meta' : 'Nova Meta de Economia'}
      >
        <SavingsGoalForm
          key={editingGoal?.id || 'new-goal'}
          initial={editingGoal}
          onSubmit={handleGoalSubmit}
          onCancel={closeGoalModal}
          onDelete={editingGoal ? handleGoalDelete : null}
        />
      </Modal>
    </div>
  )
}
