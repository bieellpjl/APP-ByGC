import { getCategoryById } from '../data/categories'
import { formatCurrency, formatShortDate } from '../utils/format'

export default function RecentTransactions({ transactions, onViewAll }) {
  return (
    <div className="panel">
      <div className="panel__header">
        <h3>Últimas Transações</h3>
        <button className="panel__link" onClick={onViewAll}>
          Ver todas →
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="tx-empty tx-empty--compact">
          <span>📋</span>
          <p>Nenhuma transação registrada</p>
        </div>
      ) : (
        <ul className="tx-list tx-list--compact">
          {transactions.map((tx) => {
            const cat = getCategoryById(tx.category)
            const isIncome = tx.type === 'income'

            return (
              <li key={tx.id} className="tx-item tx-item--compact" style={{ '--cat-color': cat.color }}>
                <div className="tx-item__icon">{cat.icon}</div>
                <div className="tx-item__info">
                  <span className="tx-item__desc">{tx.description}</span>
                  <span className="tx-item__meta">
                    {cat.label} · {formatShortDate(tx.date)}
                  </span>
                </div>
                <span
                  className={`tx-item__amount ${isIncome ? 'tx-item__amount--income' : 'tx-item__amount--expense'}`}
                >
                  {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
