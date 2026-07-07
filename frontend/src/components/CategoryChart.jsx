import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { formatCurrency } from '../utils/format'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const { name, value, payload: item } = payload[0]
  return (
    <div className="chart-tooltip">
      <span>{item.icon} {name}</span>
      <strong>{formatCurrency(value)}</strong>
    </div>
  )
}

export default function CategoryChart({ data }) {
  if (!data.length) {
    return (
      <div className="chart-empty">
        <span>📊</span>
        <p>Nenhuma despesa registrada ainda</p>
      </div>
    )
  }

  return (
    <div className="category-chart">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <ul className="category-legend">
        {data.map((item) => (
          <li key={item.name} className="category-legend__item">
            <span
              className="category-legend__dot"
              style={{ background: item.color }}
            />
            <span className="category-legend__icon">{item.icon}</span>
            <span className="category-legend__name">{item.name}</span>
            <span className="category-legend__value">{formatCurrency(item.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
