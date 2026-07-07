import { formatPeriodLabel } from '../utils/format'

export default function PeriodFilter({ period, onChange }) {
  return (
    <div className="period-filter">
      <label className="period-filter__label" htmlFor="period-select">
        <span className="period-filter__icon">📅</span>
        Período
      </label>
      <input
        id="period-select"
        type="month"
        className="period-filter__input"
        value={period}
        onChange={(e) => onChange(e.target.value)}
        aria-label={`Filtrar por ${formatPeriodLabel(period)}`}
      />
      <span className="period-filter__hint">{formatPeriodLabel(period)}</span>
    </div>
  )
}
