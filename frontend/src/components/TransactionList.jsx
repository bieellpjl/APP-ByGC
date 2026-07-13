import { getCategoryById } from "../hooks/categories";
import { formatCurrency, formatShortDate } from '../utils/format'

export default function TransactionList({ transactions, onEdit, onDelete }) {
  if (!transactions.length) {
    return (
      <div className="tx-empty">
        <span>🔍</span>
        <p>Nenhuma transação encontrada</p>
      </div>
    )
  }

  return (
    <ul className="tx-list">
      {transactions.map((tx) => {
        const cat = getCategoryById(tx.category)
        const isIncome = tx.type === 'income'

        return (
          <li key={tx.id} className="tx-item" style={{ '--cat-color': cat.color }}>
            <div className="tx-item__icon">{cat.icon}</div>
            <div className="tx-item__info">
              <span className="tx-item__desc">{tx.description}</span>
              <span className="tx-item__meta">
                {cat.label} · {formatShortDate(tx.date)}
              </span>
            </div>
            <span className={`tx-item__amount ${isIncome ? 'tx-item__amount--income' : 'tx-item__amount--expense'}`}>
              {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
            </span>
            <div className="tx-item__actions">
              <button
                className="icon-btn"
                title="Editar"
                onClick={() => onEdit(tx)}
              >
                ✏️
              </button>
              <button
                className="icon-btn icon-btn--danger"
                title="Excluir"
                onClick={() => onDelete(tx.id)}
              >
                🗑️
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
