import { useState } from 'react'

const ICONS = ['🎯', '✈️', '🏠', '🚗', '🛡️', '💻', '🎓', '💍', '🏖️', '📱']

export default function SavingsGoalForm({ initial, onSubmit, onCancel, onDelete }) {
  const [label, setLabel] = useState(initial?.label || '')
  const [targetAmount, setTargetAmount] = useState(initial?.targetAmount || '')
  const [currentAmount, setCurrentAmount] = useState(initial?.currentAmount || '')
  const [icon, setIcon] = useState(initial?.icon || '🎯')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!label.trim() || !targetAmount) return
    onSubmit({ label: label.trim(), targetAmount, currentAmount: currentAmount || 0, icon })
  }

  return (
    <form className="goal-form" onSubmit={handleSubmit}>
      <div className="goal-form__icons">
        {ICONS.map((i) => (
          <button
            key={i}
            type="button"
            className={`goal-form__icon-btn ${icon === i ? 'goal-form__icon-btn--active' : ''}`}
            onClick={() => setIcon(i)}
          >
            {i}
          </button>
        ))}
      </div>

      <div className="tx-form__fields">
        <label className="field">
          <span>Nome da meta</span>
          <input
            type="text"
            placeholder="Ex: Viagem, Reserva..."
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            required
          />
        </label>

        <div className="tx-form__row">
          <label className="field">
            <span>Valor atual (R$)</span>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="800"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
            />
          </label>
          <label className="field">
            <span>Meta (R$)</span>
            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="2000"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              required
            />
          </label>
        </div>
      </div>

      <div className="tx-form__actions">
        {onDelete && (
          <button type="button" className="btn btn--ghost btn--danger" onClick={onDelete}>
            Excluir
          </button>
        )}
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn--primary">
          {initial ? 'Salvar' : 'Criar meta'}
        </button>
      </div>
    </form>
  )
}
