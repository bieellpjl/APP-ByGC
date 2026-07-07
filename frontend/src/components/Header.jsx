export default function Header({ onAddClick }) {
  return (
    <header className="header">
      <div className="header__brand">
        <div className="header__logo">B</div>
        <div>
          <h1 className="header__title">ByGC</h1>
          <p className="header__subtitle">Controle financeiro inteligente</p>
        </div>
      </div>
      <button className="btn btn--primary" onClick={onAddClick}>
        <span className="btn__icon">+</span>
        Nova transação
      </button>
    </header>
  )
}
