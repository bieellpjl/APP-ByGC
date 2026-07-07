const STORAGE_KEY = 'bygc-transactions-v2'

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

const getDefaultTransactions = () => []
