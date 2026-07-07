import { useState, useMemo, useCallback } from 'react'
import { loadTransactions, saveTransactions } from '../utils/storage'
import { generateId } from '../utils/format'
import { getCategoryById } from '../data/categories'

export const useFinance = () => {
  const [transactions, setTransactions] = useState(loadTransactions)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const persist = useCallback((next) => {
    setTransactions(next)
    saveTransactions(next)
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

  const stats = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    const expense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    return { income, expense, balance: income - expense }
  }, [transactions])

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

  const categoryBreakdown = useMemo(() => {
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
  }, [transactions])

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

  return {
    transactions,
    filteredTransactions,
    filter,
    setFilter,
    search,
    setSearch,
    stats,
    categoryBreakdown,
    monthlyData,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    clearAll,
  }
}
