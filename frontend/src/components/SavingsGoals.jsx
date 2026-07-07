import { formatCurrency } from '../utils/format'

export default function SavingsGoals({ goals, onAddClick, onEditClick }) {
  return (
    <div className="panel">
      <div className="panel__header">
        <h3>Metas de Economia</h3>
        <button className="btn btn--ghost btn--sm" onClick={onAddClick}>
          + Nova meta
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="goals-empty">
          <span>🎯</span>
          <p>Nenhuma meta cadastrada</p>
          <button className="btn btn--primary btn--sm" onClick={onAddClick}>
            Criar meta
          </button>
        </div>
      ) : (
        <div className="goals-grid">
          {goals.map((goal) => {
            const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)

            return (
              <div key={goal.id} className="goal-card">
                <div className="goal-card__header">
                  <span className="goal-card__icon">{goal.icon || '🎯'}</span>
                  <span className="goal-card__label">{goal.label}</span>
                  <button
                    className="icon-btn goal-card__edit"
                    title="Editar meta"
                    onClick={() => onEditClick(goal)}
                  >
                    ✏️
                  </button>
                </div>
                <div className="goal-card__amounts">
                  <span className="goal-card__current">{formatCurrency(goal.currentAmount)}</span>
                  <span className="goal-card__target">de {formatCurrency(goal.targetAmount)}</span>
                </div>
                <div className="goal-card__bar">
                  <div
                    className="goal-card__bar-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="goal-card__pct">{Math.round(progress)}% concluído</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
