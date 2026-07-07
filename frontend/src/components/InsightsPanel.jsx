export default function InsightsPanel({ insights }) {
  if (!insights.length) {
    return (
      <div className="insights-panel">
        <div className="insight-item insight-item--info">
          <span className="insight-item__icon">💡</span>
          <p>Adicione transações para receber insights personalizados sobre seus gastos.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="insights-panel">
      {insights.map((insight) => (
        <div key={insight.id} className={`insight-item insight-item--${insight.type}`}>
          <span className="insight-item__icon">{insight.icon}</span>
          <p>{insight.message}</p>
        </div>
      ))}
    </div>
  )
}
