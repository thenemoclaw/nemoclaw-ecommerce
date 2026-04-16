import { useCallback, useEffect, useMemo, useState } from 'react'
import TopNav from './components/TopNav'
import CartSidebar from './components/CartSidebar'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ProductListPage from './pages/ProductListPage'
import CheckoutPage from './pages/CheckoutPage'
import './App.css'

const APP_USERS = [
  { username: 'ankit', password: 'shop123' },
  { username: 'abhay', password: 'shop123' },
]

const STORAGE_KEYS = {
  user: 'nm_user',
  cart: 'nm_cart',
  metrics: 'nm_metrics',
  orders: 'nm_orders',
  updates: 'nm_updates',
}

const DEFAULT_METRICS = {
  placedCount: 0,
  deliveredCount: 0,
  totalSpent: 0,
}

const KNOWN_ROUTES = ['/login', '/dashboard', '/products', '/checkout']

function readSessionJson(key, fallback) {
  try {
    const raw = sessionStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function getPath() {
  const currentPath = window.location.pathname
  return KNOWN_ROUTES.includes(currentPath) ? currentPath : '/login'
}

function App() {
  const [path, setPath] = useState(getPath)
  const [authUser, setAuthUser] = useState(() => readSessionJson(STORAGE_KEYS.user, null))
  const [cartItems, setCartItems] = useState(() => readSessionJson(STORAGE_KEYS.cart, []))
  const [metrics, setMetrics] = useState(() =>
    readSessionJson(STORAGE_KEYS.metrics, DEFAULT_METRICS),
  )
  const [orders, setOrders] = useState(() => readSessionJson(STORAGE_KEYS.orders, []))
  const [updates, setUpdates] = useState(() => readSessionJson(STORAGE_KEYS.updates, []))
  const [cartOpen, setCartOpen] = useState(false)
  const [flashMessage, setFlashMessage] = useState('')

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  )

  const cartTotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems],
  )

  const effectivePath = useMemo(() => {
    if (!authUser) {
      return '/login'
    }

    if (path === '/login') {
      return '/dashboard'
    }

    if (!KNOWN_ROUTES.includes(path)) {
      return '/dashboard'
    }

    return path
  }, [authUser, path])

  const navigate = useCallback(
    (nextPath, replace = false) => {
      if (nextPath === path) {
        return
      }

      if (replace) {
        window.history.replaceState({}, '', nextPath)
      } else {
        window.history.pushState({}, '', nextPath)
      }

      setPath(nextPath)
    },
    [path],
  )

  useEffect(() => {
    const onPopState = () => setPath(getPath())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.user, JSON.stringify(authUser))
  }, [authUser])

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.metrics, JSON.stringify(metrics))
  }, [metrics])

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders))
  }, [orders])

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.updates, JSON.stringify(updates))
  }, [updates])

  useEffect(() => {
    if (effectivePath !== path) {
      window.history.replaceState({}, '', effectivePath)
    }
  }, [effectivePath, path])

  useEffect(() => {
    if (!flashMessage) {
      return
    }

    const timer = setTimeout(() => setFlashMessage(''), 5000)
    return () => clearTimeout(timer)
  }, [flashMessage])

  const login = (username, password) => {
    const normalizedUsername = username.trim().toLowerCase()
    const user = APP_USERS.find(
      (item) => item.username === normalizedUsername && item.password === password,
    )

    if (!user) {
      return false
    }

    setAuthUser({ username: user.username })
    setUpdates((current) => [
      {
        id: Date.now(),
        event: `${user.username} logged in successfully.`,
        at: new Date().toLocaleTimeString(),
      },
      ...current,
    ].slice(0, 8))
    setFlashMessage('Welcome! You are now logged in.')
    navigate('/dashboard')
    return true
  }

  const logout = () => {
    setAuthUser(null)
    setCartItems([])
    setOrders([])
    setMetrics(DEFAULT_METRICS)
    setCartOpen(false)
    setUpdates([])
    setFlashMessage('You have logged out. Session history is cleared.')
    Object.values(STORAGE_KEYS).forEach((key) => sessionStorage.removeItem(key))
    navigate('/login', true)
  }

  const addToCart = (product) => {
    setCartItems((current) => {
      const found = current.find((item) => item.id === product.id)

      if (found) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }

      return [
        ...current,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          description: product.description,
          quantity: 1,
        },
      ]
    })

    setFlashMessage('Product added to cart.')
  }

  const updateQuantity = (productId, nextQuantity) => {
    setCartItems((current) => {
      if (nextQuantity <= 0) {
        return current.filter((item) => item.id !== productId)
      }

      return current.map((item) =>
        item.id === productId ? { ...item, quantity: nextQuantity } : item,
      )
    })
  }

  const increaseQuantity = (productId) => {
    const item = cartItems.find((entry) => entry.id === productId)
    if (item) {
      updateQuantity(productId, item.quantity + 1)
    }
  }

  const decreaseQuantity = (productId) => {
    const item = cartItems.find((entry) => entry.id === productId)
    if (item) {
      updateQuantity(productId, item.quantity - 1)
    }
  }

  const placeOrder = () => {
    if (!cartItems.length) {
      return
    }

    const order = {
      id: Date.now(),
      itemCount: cartCount,
      total: Number(cartTotal.toFixed(2)),
      at: new Date().toLocaleString(),
    }

    setOrders((current) => [order, ...current].slice(0, 8))
    setMetrics((current) => ({
      placedCount: current.placedCount + 1,
      deliveredCount: current.deliveredCount + 1,
      totalSpent: Number((current.totalSpent + cartTotal).toFixed(2)),
    }))
    setUpdates((current) => [
      {
        id: Date.now() + 1,
        event: `${authUser?.username || 'User'} successfully ordered ${cartCount} product(s).`,
        at: new Date().toLocaleTimeString(),
      },
      ...current,
    ].slice(0, 8))
    setCartItems([])
    setCartOpen(false)
    setFlashMessage('Order placed successfully.')
    navigate('/dashboard')
  }

  const getItemQty = (productId) => {
    const entry = cartItems.find((item) => item.id === productId)
    return entry ? entry.quantity : 0
  }

  if (effectivePath === '/login') {
    return (
      <div className="app-shell app-shell-login">
        {flashMessage && <p className="flash-banner">{flashMessage}</p>}
        <LoginPage onLogin={login} demoPassword="shop123" />
      </div>
    )
  }

  return (
    <div className="app-shell">
      <TopNav
        currentPath={effectivePath}
        onNavigate={navigate}
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        onLogout={logout}
      />

      {flashMessage && <p className="flash-banner">{flashMessage}</p>}

      <main className="page-shell">
        {effectivePath === '/dashboard' && (
          <DashboardPage
            user={authUser}
            cartCount={cartCount}
            metrics={metrics}
            orders={orders}
            updates={updates}
            onNavigate={navigate}
          />
        )}

        {effectivePath === '/products' && (
          <ProductListPage
            onAddToCart={addToCart}
            onIncreaseQuantity={increaseQuantity}
            onDecreaseQuantity={decreaseQuantity}
            getItemQty={getItemQty}
          />
        )}

        {effectivePath === '/checkout' && (
          <CheckoutPage
            cartItems={cartItems}
            cartTotal={cartTotal}
            onPlaceOrder={placeOrder}
            onNavigate={navigate}
          />
        )}
      </main>

      <CartSidebar
        isOpen={cartOpen}
        cartItems={cartItems}
        cartTotal={cartTotal}
        onClose={() => setCartOpen(false)}
        onIncreaseQuantity={increaseQuantity}
        onDecreaseQuantity={decreaseQuantity}
        onCheckout={() => {
          setCartOpen(false)
          navigate('/checkout')
        }}
      />
    </div>
  )
}

export default App
