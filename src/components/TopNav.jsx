function TopNav({
  currentPath,
  onNavigate,
  cartCount,
  onOpenCart,
  onLogout,
}) {
  return (
    <header className="top-nav">
      <div className="brand-block" onClick={() => onNavigate('/dashboard')}>
        <p className="brand-kicker">Nemoclaw</p>
        <h1 className="brand-title">Commerce</h1>
      </div>

      <nav className="nav-links" aria-label="Main navigation">
        <button
          className={`nav-link ${currentPath === '/dashboard' ? 'active' : ''}`}
          onClick={() => onNavigate('/dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`nav-link ${currentPath === '/products' ? 'active' : ''}`}
          onClick={() => onNavigate('/products')}
        >
          Products
        </button>
      </nav>

      <div className="nav-actions">
        <button className="cart-chip" onClick={onOpenCart}>
          Cart ({cartCount})
        </button>
        <button className="ghost-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  )
}

export default TopNav
