function CheckoutPage({ cartItems, cartTotal, onPlaceOrder, onNavigate }) {
  return (
    <section className="page-content checkout-page">
      <div className="checkout-card">
        <div className="page-header">
          <div>
            <p className="tag">Checkout</p>
            <h2>Final payment and order placement</h2>
          </div>
        </div>

        {!cartItems.length ? (
          <div className="panel small checkout-empty">
            <p className="muted">Your cart is empty.</p>
            <button className="primary-btn" onClick={() => onNavigate('/products')}>
              Go to products
            </button>
          </div>
        ) : (
          <>
            <div className="panel">
              <h3>Order Summary</h3>
              <ul className="checkout-list">
                {cartItems.map((item) => (
                  <li key={item.id}>
                    <span>{item.title}</span>
                    <span>
                      {item.quantity} x ${item.price.toFixed(2)}
                    </span>
                    <strong>${(item.quantity * item.price).toFixed(2)}</strong>
                  </li>
                ))}
              </ul>

              <div className="total-row checkout-total">
                <span>Final payment</span>
                <strong>${cartTotal.toFixed(2)}</strong>
              </div>
            </div>

            <button className="primary-btn checkout-submit" onClick={onPlaceOrder}>
              Order Placed
            </button>
          </>
        )}
      </div>
    </section>
  )
}

export default CheckoutPage
