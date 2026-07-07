import { useState } from 'react'
import { CATEGORIES } from '../data/categories'

const emptyForm = {
  type: 'expense',
  category: 'food',
  description: '',
  amount: '',
  date: new Date().toISOString().split('T')[0],
}

export default function TransactionForm({ onSubmit, onCancel, initial }) {
  const [form, setForm] = useState(initial || emptyForm)

  const categories = CATEGORIES[form.type]

  const handleTypeChange = (type) => {
    const firstCat = CATEGORIES[type][0].id
    setForm((f) => ({ ...f, type, category: firstCat }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.description.trim() || !form.amount || Number(form.amount) <= 0) return
    onSubmit(form)
  }

  return (
    <form className="tx-form" onSubmit={handleSubmit}>
      <div className="tx-form__type-toggle">
        <button
          type="button"
          className={`type-btn ${form.type === 'income' ? 'type-btn--active type-btn--income' : ''}`}
          onClick={() => handleTypeChange('income')}
        >
          ↑ Receita
        </button>
        <button
          type="button"
          className={`type-btn ${form.type === 'expense' ? 'type-btn--active type-btn--expense' : ''}`}
          onClick={() => handleTypeChange('expense')}
        >
          ↓ Despesa
        </button>
      </div>

      <div className="tx-form__categories">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`cat-btn ${form.category === cat.id ? 'cat-btn--active' : ''}`}
            style={{ '--cat-color': cat.color }}
            onClick={() => setForm((f) => ({ ...f, category: cat.id }))}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="tx-form__fields">
        <label className="field">
          <span>Descrição</span>
          <input
            type="text"
            placeholder="Ex: Almoço no restaurante"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            autoFocus
          />
        </label>

        <div className="tx-form__row">
          <label className="field">
            <span>Valor (R$)</span>
            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0,00"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            />
          </label>
          <label className="field">
            <span>Data</span>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
          </label>
        </div>
      </div>

      <div className="tx-form__actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn--primary">
          {initial ? 'Salvar alterações' : 'Adicionar'}
        </button>
      </div>
    </form>
  )
}
