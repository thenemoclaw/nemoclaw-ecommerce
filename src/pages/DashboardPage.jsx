function DashboardPage({ user, cartCount, metrics, orders, updates, onNavigate }) {

  const metricsCards = [
    {
      id: 'cart',
      title: 'Cart Items',
      value: cartCount,
      description: 'Live from your cart',
      theme: 'violet',
    },
    {
      id: 'placed',
      title: 'Orders Placed',
      value: metrics.placedCount,
      description: 'All completed checkouts',
      theme: 'pink',
    },
    {
      id: 'delivered',
      title: 'Orders Delivered',
      value: metrics.deliveredCount,
      description: 'Shipped and delivered',
      theme: 'amber',
    },
  ]

  const tableRows =
    orders.length > 0
      ? orders.map((order) => ({
          id: order.id,
          product: `Order #${String(order.id).slice(-6)}`,
          tracking: String(order.id).slice(-8),
          date: order.at,
          status: 'Delivered',
          amount: `$${order.total.toFixed(2)}`,
        }))
      : [
          {
            id: 'sample-1',
            product: 'Reebok Air',
            tracking: '18908424',
            date: '2 March 2022',
            status: 'Approved',
            amount: '$280.00',
          },
          {
            id: 'sample-2',
            product: 'Nike Blue',
            tracking: '18908425',
            date: '2 March 2022',
            status: 'Pending',
            amount: '$190.00',
          },
          {
            id: 'sample-3',
            product: 'Park Avenue',
            tracking: '18908426',
            date: '2 March 2022',
            status: 'Approved',
            amount: '$210.00',
          },
          {
            id: 'sample-4',
            product: 'Wild Storm Soap',
            tracking: '18908427',
            date: '2 March 2022',
            status: 'Delivered',
            amount: '$95.00',
          },
        ]

  return (
    <section className="page-content dashboard-page">
      <div className="dashboard-layout">
        <div className="dashboard-main">
          <div className="page-header">
            <div>
              <p className="tag">Overview</p>
              <h2>Dashboard</h2>
            </div>
            <button className="ghost-btn" onClick={() => onNavigate('/products')}>
              Browse products
            </button>
          </div>

          <div className="kpi-grid">
            {metricsCards.map((card) => (
              <article key={card.id} className={`kpi-card ${card.theme}`}>
                <p>{card.title}</p>
                <h3>{card.value}</h3>
                <small>{card.description}</small>
              </article>
            ))}
          </div>

          <div className="orders-table-card">
            <h3>Recent Orders</h3>
            <div className="orders-table-wrap">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Tracking ID</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row) => (
                    <tr key={row.id}>
                      <td>{row.product}</td>
                      <td>{row.tracking}</td>
                      <td>{row.date}</td>
                      <td>
                        <span
                          className={`status-pill ${row.status.toLowerCase()}`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td>{row.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <aside className="dashboard-side">
          <div className="panel updates-panel">
            <h3>Updates</h3>
            {!updates.length ? (
              <p className="muted">No updates yet. Login and place an order to see activity.</p>
            ) : (
              <ul>
                {updates.map((item) => (
                  <li key={item.id}>
                    <div className="update-avatar">{user?.username?.charAt(0)?.toUpperCase() || 'U'}</div>
                    <p>{item.event}</p>
                    <span>{item.at}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="panel review-panel">
            <h3>Customer Review</h3>
            <div className="review-chart" aria-hidden="true">
              <span className="wave"></span>
            </div>
            <div className="review-time">
              <span>01:00</span>
              <span>02:00</span>
              <span>03:00</span>
              <span>04:00</span>
              <span>05:00</span>
              <span>06:00</span>
            </div>
            <p className="muted">Welcome, {user?.username}. Track customer quality signals here.</p>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default DashboardPage
