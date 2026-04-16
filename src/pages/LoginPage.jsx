import { useState } from 'react'

function LoginPage({ onLogin, demoPassword }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (event) => {
    event.preventDefault()
    const isSuccess = onLogin(username, password)

    if (!isSuccess) {
      setError('Invalid credentials. Use Ankit/Abhay and shared password.')
      return
    }

    setError('')
  }

  return (
    <section className="login-page">
      <div className="login-left">
        <p className="tag">Simple Ecommerce</p>
        <h1>Login to continue shopping</h1>
        <p>
          Allowed users: <strong>ankit</strong> and <strong>abhay</strong>
        </p>
        <p>
          Common password for both users: <strong>{demoPassword}</strong>
        </p>
      </div>

      <form className="login-card" onSubmit={onSubmit}>
        <h2>Sign In</h2>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          placeholder="ankit or abhay"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Enter common password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {error && <p className="error-text">{error}</p>}

        <button className="primary-btn" type="submit">
          Login
        </button>
      </form>
    </section>
  )
}

export default LoginPage
