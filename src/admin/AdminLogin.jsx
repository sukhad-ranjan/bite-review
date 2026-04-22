import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isTokenValid } from './adminAuth'

const API_BASE = import.meta.env.VITE_API_URL

const CANTEENS = [
  { id: 'snackers', name: 'Snackers' },
  { id: 'nescafe', name: 'Nescafe' },
  { id: 'yadav', name: 'Yadav Canteen' },
  { id: 'night', name: 'Night Canteen' },
  { id: 'campus', name: 'Campus Cafe' },
]

export default function AdminLogin() {
  const navigate = useNavigate()
  const [canteenId, setCanteenId] = useState(CANTEENS[0].id)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const existingToken = window.sessionStorage.getItem('admin_token')
    if (isTokenValid(existingToken)) {
      navigate('/admin/dashboard', { replace: true })
    }
  }, [navigate])

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
    const response = await fetch(`${API_BASE}/admin/login.php`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          canteen_id: canteenId,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success || !data.token) {
        throw new Error(data.message || 'Login failed')
      }

      window.sessionStorage.setItem('admin_token', data.token)
      window.sessionStorage.setItem('admin_canteen_id', data.canteen_id)
      navigate('/admin/dashboard', { replace: true })
    } catch (requestError) {
      setError(requestError.message || 'Unable to sign in right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-shell admin-login-wrapper">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <div className="brand-logo">BR</div>
          <div>
            <h1>Bite Review</h1>
            <p>Admin Portal</p>
          </div>
        </div>

        <div className="admin-login-copy">
          <p>
            Sign in with your canteen account to review this week&apos;s feedback, export reports,
            and email the latest summary.
          </p>
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          <label className={error ? 'admin-field admin-field--error' : 'admin-field'}>
            <span>Canteen</span>
            <select value={canteenId} onChange={(event) => setCanteenId(event.target.value)} aria-label="Select canteen">
              {CANTEENS.map((canteen) => (
                <option key={canteen.id} value={canteen.id}>
                  {canteen.name}
                </option>
              ))}
            </select>
          </label>

          <label className={error ? 'admin-field admin-field--error' : 'admin-field'}>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your admin password"
              autoComplete="current-password"
              aria-label="Admin password"
              required
            />
          </label>

          <div className={`admin-login-error ${error ? 'visible' : ''}`}>{error}</div>

          <button type="submit" className="admin-primary-btn admin-login-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <Link className="admin-back-link" to="/">
          Back to Bite Review
        </Link>
      </div>
    </div>
  )
}
