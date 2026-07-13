export default function Header({ onAddClick, isDark, onThemeToggle }) {
  return (
    <header className="header">
      <div className="header__brand">
        <img src="/dinheiro.png" alt="Logo ByGC" className="header__logo-img" />
        <div>
          <h1 className="header__title">ByGC</h1>
          <p className="header__subtitle">Controle financeiro inteligente</p>
        </div>
      </div>
      <div className="header__actions">
        <button
          className="btn btn--ghost theme-toggle"
          onClick={onThemeToggle}
          aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
          title={isDark ? 'Modo claro' : 'Modo escuro'}
        >
          <span className="theme-toggle__icon">{isDark ? '☀️' : '🌙'}</span>
        </button>
        <button className="btn btn--primary" onClick={onAddClick}>
          <span className="btn__icon">+</span>
          Nova transação
        </button>
      </div>
    </header>
  )
}
