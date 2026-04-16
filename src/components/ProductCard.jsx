function ProductCard({
  product,
  quantity,
  onAddToCart,
  onIncreaseQuantity,
  onDecreaseQuantity,
}) {
  return (
    <article className="product-card">
      <img src={product.image} alt={product.title} />
      <div className="product-content">
        <h3>{product.title}</h3>
        <p className="description">{product.description}</p>
        <div className="price-row">
          <strong>${product.price.toFixed(2)}</strong>
          <span>
            Subtotal: ${(product.price * (quantity || 1)).toFixed(2)}
          </span>
        </div>
      </div>

      {quantity > 0 ? (
        <div className="qty-control product-qty-control">
          <button onClick={() => onDecreaseQuantity(product.id)}>-</button>
          <span>{quantity}</span>
          <button onClick={() => onIncreaseQuantity(product.id)}>+</button>
        </div>
      ) : (
        <button
          className="primary-btn product-action-btn"
          onClick={() => onAddToCart(product)}
        >
          Add to Cart
        </button>
      )}
    </article>
  )
}

export default ProductCard
