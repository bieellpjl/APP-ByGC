import { formatCurrency } from '../utils/format'

export default function BalanceCard({ label, value, variant, icon, trend }) {
  const variants = {
    balance: 'card--balance',
    income: 'card--income',
    expense: 'card--expense',
  }

  return (
    <div className={`balance-card ${variants[variant]}`}>
      <div className="balance-card__header">
        <span className="balance-card__icon">{icon}</span>
        <span className="balance-card__label">{label}</span>
      </div>
      <p className="balance-card__value">{formatCurrency(value)}</p>
      {trend && <span className="balance-card__trend">{trend}</span>}
    </div>
  )
}
