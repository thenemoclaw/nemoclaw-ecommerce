import { useEffect, useRef, useState } from 'react'
import ProductCard from '../components/ProductCard'

const API_URL = 'https://fakestoreapi.com/products?limit=18'
const BATCH_SIZE = 6
const MIN_LOADER_MS = 2000

function ProductListPage({
  onAddToCart,
  onIncreaseQuantity,
  onDecreaseQuantity,
  getItemQty,
}) {
  const [products, setProducts] = useState([])
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const loadMoreRef = useRef(null)

  const fetchProducts = async () => {
    setLoading(true)
    setError('')

    try {
      const [response] = await Promise.all([
        fetch(API_URL),
        new Promise((resolve) => setTimeout(resolve, MIN_LOADER_MS)),
      ])
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()
      setProducts(data)
      setVisibleCount(BATCH_SIZE)
    } catch {
      setError('Unable to load products. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    const target = loadMoreRef.current
    if (!target) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry.isIntersecting) {
          return
        }

        setVisibleCount((current) =>
          current >= products.length ? current : Math.min(current + BATCH_SIZE, products.length),
        )
      },
      { rootMargin: '150px' },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [products.length])

  const visibleProducts = products.slice(0, visibleCount)

  return (
    <section className="page-content">
      <div className="page-header">
        <div>
          <p className="tag">Product List</p>
          <h2>Choose products and manage quantity with + and -</h2>
        </div>
      </div>

      {loading && (
        <div className="products-grid">
          {Array.from({ length: BATCH_SIZE }).map((_, index) => (
            <article key={index} className="product-card skeleton-card" aria-hidden="true">
              <div className="skeleton-image"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line short"></div>
              <div className="skeleton-line"></div>
            </article>
          ))}
        </div>
      )}

      {error && (
        <div className="panel small">
          <p className="error-text">{error}</p>
          <button className="ghost-btn" onClick={fetchProducts}>
            Retry
          </button>
        </div>
      )}

      <div className="products-grid">
        {visibleProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            quantity={getItemQty(product.id)}
            onAddToCart={onAddToCart}
            onIncreaseQuantity={onIncreaseQuantity}
            onDecreaseQuantity={onDecreaseQuantity}
          />
        ))}
      </div>

      {!!products.length && (
        <p className="muted list-count">
          Showing {visibleProducts.length} of {products.length} products
        </p>
      )}

      {visibleCount < products.length && <div className="load-trigger" ref={loadMoreRef}></div>}
    </section>
  )
}

export default ProductListPage
