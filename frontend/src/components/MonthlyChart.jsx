import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { formatCurrency } from '../utils/format'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <span className="chart-tooltip__month">{label}</span>
      {payload.map((p) => (
        <div key={p.dataKey} className="chart-tooltip__row">
          <span style={{ color: p.color }}>{p.name}</span>
          <strong>{formatCurrency(p.value)}</strong>
        </div>
      ))}
    </div>
  )
}

export default function MonthlyChart({ data }) {
  if (!data.length) {
    return (
      <div className="chart-empty">
        <span>📅</span>
        <p>Adicione transações para ver o histórico mensal</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} barGap={4} barCategoryGap="20%">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#94a3b8', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
        <Legend
          wrapperStyle={{ fontSize: 13, color: '#94a3b8', paddingTop: 12 }}
        />
        <Bar
          dataKey="income"
          name="Receitas"
          fill="#10b981"
          radius={[6, 6, 0, 0]}
          animationDuration={800}
        />
        <Bar
          dataKey="expense"
          name="Despesas"
          fill="#ef4444"
          radius={[6, 6, 0, 0]}
          animationDuration={800}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
