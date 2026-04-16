function CartSidebar({
  isOpen,
  cartItems,
  cartTotal,
  onClose,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onCheckout,
}) {
  return (
    <>
      {isOpen && <div className="cart-backdrop" onClick={onClose}></div>}

      <aside className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="cart-head">
          <h2>Your Cart</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close cart">
            x
          </button>
        </div>

        <div className="cart-body">
          {cartItems.length === 0 ? (
            <p className="muted">No products yet. Add from products page.</p>
          ) : (
            cartItems.map((item) => (
              <article key={item.id} className="cart-item">
                <img src={item.image} alt={item.title} />
                <div className="cart-item-main">
                  <h3>{item.title}</h3>
                  <p className="cart-item-description">{item.description}</p>
                  <p>${item.price.toFixed(2)}</p>
                  <div className="qty-control compact">
                    <button onClick={() => onDecreaseQuantity(item.id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onIncreaseQuantity(item.id)}>+</button>
                  </div>
                </div>
                <strong>${(item.price * item.quantity).toFixed(2)}</strong>
              </article>
            ))
          )}
        </div>

        <div className="cart-foot">
          <div className="total-row">
            <span>Total</span>
            <strong>${cartTotal.toFixed(2)}</strong>
          </div>
          <button
            className="primary-btn"
            disabled={!cartItems.length}
            onClick={onCheckout}
          >
            Checkout
          </button>
        </div>
      </aside>
    </>
  )
}

export default CartSidebar
