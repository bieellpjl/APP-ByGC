export const CATEGORIES = {
  income: [
    { id: 'salary', label: 'Salário', icon: '💼', color: '#10b981' },
    { id: 'freelance', label: 'Freelance', icon: '💻', color: '#06b6d4' },
    { id: 'investment', label: 'Investimentos', icon: '📈', color: '#8b5cf6' },
    { id: 'other-income', label: 'Outros', icon: '💰', color: '#22c55e' },
  ],
  expense: [
    { id: 'food', label: 'Alimentação', icon: '🍔', color: '#f59e0b' },
    { id: 'transport', label: 'Transporte', icon: '🚗', color: '#3b82f6' },
    { id: 'housing', label: 'Moradia', icon: '🏠', color: '#ef4444' },
    { id: 'health', label: 'Saúde', icon: '💊', color: '#ec4899' },
    { id: 'leisure', label: 'Lazer', icon: '🎮', color: '#a855f7' },
    { id: 'shopping', label: 'Compras', icon: '🛍️', color: '#f97316' },
    { id: 'other-expense', label: 'Outros', icon: '📦', color: '#64748b' },
  ],
}

export const getCategoryById = (id) => {
  const all = [...CATEGORIES.income, ...CATEGORIES.expense]
  return all.find((c) => c.id === id) || { id, label: 'Desconhecido', icon: '❓', color: '#94a3b8' }
}
