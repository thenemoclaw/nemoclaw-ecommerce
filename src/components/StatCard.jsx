function StatCard({ label, value, accent }) {
  return (
    <article className="stat-card">
      <p>{label}</p>
      <h3 className={accent ? 'accent' : ''}>{value}</h3>
    </article>
  )
}

export default StatCard
