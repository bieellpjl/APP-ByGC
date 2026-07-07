const STORAGE_KEY = 'bygc-transactions-v2'
const GOALS_STORAGE_KEY = 'bygc-savings-goals-v1'

export const loadTransactions = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return getDefaultTransactions()
    return JSON.parse(raw)
  } catch {
    return getDefaultTransactions()
  }
}

export const saveTransactions = (transactions) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
}

export const loadSavingsGoals = () => {
  try {
    const raw = localStorage.getItem(GOALS_STORAGE_KEY)
    if (!raw) return getDefaultSavingsGoals()
    return JSON.parse(raw)
  } catch {
    return getDefaultSavingsGoals()
  }
}

export const saveSavingsGoals = (goals) => {
  localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals))
}

const getDefaultTransactions = () => []

const getDefaultSavingsGoals = () => [
  { id: 'goal-viagem', label: 'Viagem', targetAmount: 2000, currentAmount: 800, icon: '✈️' },
  { id: 'goal-reserva', label: 'Reserva de Emergência', targetAmount: 10000, currentAmount: 3500, icon: '🛡️' },
]
