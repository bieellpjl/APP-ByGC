import { useState, useMemo, useCallback } from 'react'
import {
  loadTransactions,
  saveTransactions,
  loadSavingsGoals,
  saveSavingsGoals,
} from '../utils/storage'
import { generateId, getCurrentPeriod, getPreviousPeriod } from '../utils/format'
import { getCategoryById } from '../data/categories'

const filterByPeriod = (transactions, period) =>
  transactions.filter((t) => t.date.startsWith(period))

const computeStats = (transactions) => {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  return { income, expense, balance: income - expense }
}

const computeCategoryBreakdown = (transactions) => {
  const expenses = transactions.filter((t) => t.type === 'expense')
  const map = {}
  expenses.forEach((t) => {
    const cat = getCategoryById(t.category)
    if (!map[t.category]) {
      map[t.category] = { name: cat.label, value: 0, color: cat.color, icon: cat.icon }
    }
    map[t.category].value += t.amount
  })
  return Object.values(map).sort((a, b) => b.value - a.value)
}

const computeInsights = (currentTx, previousTx, stats) => {
  const insights = []

  const currentExpenses = currentTx.filter((t) => t.type === 'expense')
  const previousExpenses = previousTx.filter((t) => t.type === 'expense')

  const currentByCat = {}
  currentExpenses.forEach((t) => {
    currentByCat[t.category] = (currentByCat[t.category] || 0) + t.amount
  })

  const previousByCat = {}
  previousExpenses.forEach((t) => {
    previousByCat[t.category] = (previousByCat[t.category] || 0) + t.amount
  })

  Object.entries(currentByCat).forEach(([catId, currentAmount]) => {
    const previousAmount = previousByCat[catId] || 0
    if (previousAmount === 0) return

    const diff = ((currentAmount - previousAmount) / previousAmount) * 100
    const cat = getCategoryById(catId)

    if (diff >= 10) {
      insights.push({
        id: `cat-up-${catId}`,
        type: 'warning',
        icon: cat.icon,
        message: `Você gastou ${Math.round(diff)}% a mais em ${cat.label} esse mês`,
      })
    } else if (diff <= -10) {
      insights.push({
        id: `cat-down-${catId}`,
        type: 'success',
        icon: cat.icon,
        message: `Você economizou ${Math.abs(Math.round(diff))}% em ${cat.label} comparado ao mês anterior`,
      })
    }
  })

  if (stats.income > 0) {
    const savingsRate = (stats.balance / stats.income) * 100
    if (savingsRate >= 20) {
      insights.push({
        id: 'savings-good',
        type: 'success',
        icon: '💰',
        message: `Ótimo! Você está economizando ${Math.round(savingsRate)}% das suas receitas`,
      })
    } else if (savingsRate < 0) {
      insights.push({
        id: 'savings-bad',
        type: 'danger',
        icon: '⚠️',
        message: 'Atenção: suas despesas superaram as receitas neste período',
      })
    }
  }

  const topCategory = computeCategoryBreakdown(currentExpenses)[0]
  if (topCategory && stats.expense > 0) {
    const pct = Math.round((topCategory.value / stats.expense) * 100)
    insights.push({
      id: 'top-category',
      type: 'info',
      icon: topCategory.icon,
      message: `${topCategory.name} representa ${pct}% dos seus gastos este mês`,
    })
  }

  return insights
}

export const useFinance = () => {
  const [transactions, setTransactions] = useState(loadTransactions)
  const [savingsGoals, setSavingsGoals] = useState(loadSavingsGoals)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [period, setPeriod] = useState(getCurrentPeriod)

  const persist = useCallback((next) => {
    setTransactions(next)
    saveTransactions(next)
  }, [])

  const persistGoals = useCallback((next) => {
    setSavingsGoals(next)
    saveSavingsGoals(next)
  }, [])

  const addTransaction = useCallback(
    (data) => {
      const newTx = { ...data, id: generateId(), amount: Number(data.amount) }
      persist([newTx, ...transactions])
    },
    [transactions, persist]
  )

  const updateTransaction = useCallback(
    (id, data) => {
      persist(
        transactions.map((t) =>
          t.id === id ? { ...t, ...data, amount: Number(data.amount) } : t
        )
      )
    },
    [transactions, persist]
  )

  const deleteTransaction = useCallback(
    (id) => {
      persist(transactions.filter((t) => t.id !== id))
    },
    [transactions, persist]
  )

  const clearAll = useCallback(() => {
    persist([])
  }, [persist])

  const addSavingsGoal = useCallback(
    (data) => {
      const goal = {
        ...data,
        id: generateId(),
        targetAmount: Number(data.targetAmount),
        currentAmount: Number(data.currentAmount),
      }
      persistGoals([...savingsGoals, goal])
    },
    [savingsGoals, persistGoals]
  )

  const updateSavingsGoal = useCallback(
    (id, data) => {
      persistGoals(
        savingsGoals.map((g) =>
          g.id === id
            ? {
                ...g,
                ...data,
                targetAmount: Number(data.targetAmount ?? g.targetAmount),
                currentAmount: Number(data.currentAmount ?? g.currentAmount),
              }
            : g
        )
      )
    },
    [savingsGoals, persistGoals]
  )

  const deleteSavingsGoal = useCallback(
    (id) => {
      persistGoals(savingsGoals.filter((g) => g.id !== id))
    },
    [savingsGoals, persistGoals]
  )

  const periodTransactions = useMemo(
    () => filterByPeriod(transactions, period),
    [transactions, period]
  )

  const previousPeriod = useMemo(() => getPreviousPeriod(period), [period])

  const previousPeriodTransactions = useMemo(
    () => filterByPeriod(transactions, previousPeriod),
    [transactions, previousPeriod]
  )

  const stats = useMemo(() => computeStats(periodTransactions), [periodTransactions])

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchType = filter === 'all' || t.type === filter
      const matchSearch =
        !search ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        getCategoryById(t.category).label.toLowerCase().includes(search.toLowerCase())
      return matchType && matchSearch
    })
  }, [transactions, filter, search])

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
      .slice(0, 5)
  }, [transactions])

  const categoryBreakdown = useMemo(
    () => computeCategoryBreakdown(periodTransactions),
    [periodTransactions]
  )

  const monthlyData = useMemo(() => {
    const months = {}
    transactions.forEach((t) => {
      const month = t.date.slice(0, 7)
      if (!months[month]) months[month] = { month, income: 0, expense: 0 }
      if (t.type === 'income') months[month].income += t.amount
      else months[month].expense += t.amount
    })
    return Object.values(months)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6)
      .map((m) => ({
        ...m,
        label: new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(
          new Date(m.month + '-01T12:00:00')
        ),
      }))
  }, [transactions])

  const insights = useMemo(
    () => computeInsights(periodTransactions, previousPeriodTransactions, stats),
    [periodTransactions, previousPeriodTransactions, stats]
  )

  return {
    transactions,
    filteredTransactions,
    recentTransactions,
    filter,
    setFilter,
    search,
    setSearch,
    period,
    setPeriod,
    stats,
    categoryBreakdown,
    monthlyData,
    insights,
    savingsGoals,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    clearAll,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
  }
}
