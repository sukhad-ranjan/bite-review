import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import EmptyState from '../components/EmptyState'
import Spinner from '../components/Spinner'
import StarRating from '../components/StarRating'

const API_BASE = import.meta.env.VITE_API_URL

const CANTEEN_NAMES = {
  snackers: 'Snackers',
  nescafe: 'Nescafe',
  yadav: 'Yadav Canteen',
  night: 'Night Canteen',
  campus: 'Campus Cafe',
}

const CHART_COLORS = ['#c2410c', '#ea580c', '#f59e0b', '#65a30d', '#15803d']

function getCurrentIsoWeekInfo() {
  const current = new Date()
  const date = new Date(Date.UTC(current.getFullYear(), current.getMonth(), current.getDate()))
  const dayNumber = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() + 4 - dayNumber)

  const isoYear = date.getUTCFullYear()
  const yearStart = new Date(Date.UTC(isoYear, 0, 1))
  const week = Math.ceil((((date - yearStart) / 86400000) + 1) / 7)

  const rangeStart = new Date(date)
  rangeStart.setUTCDate(date.getUTCDate() - 3)

  const rangeEnd = new Date(rangeStart)
  rangeEnd.setUTCDate(rangeStart.getUTCDate() + 6)

  return {
    isoYear,
    week,
    startLabel: formatDate(rangeStart),
    endLabel: formatDate(rangeEnd),
  }
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(value)
}

function formatFeedbackDate(value) {
  if (!value) return 'Unknown time'
  const parsed = new Date(value.replace(' ', 'T'))
  if (Number.isNaN(parsed.getTime())) return value

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(parsed)
}

function buildSummary(report, canteenName) {
  const topItem = report.top_items?.[0]?.item_name || 'No standout item yet'
  const sentiment =
    report.avg_rating >= 4
      ? 'Students are responding very positively overall.'
      : report.avg_rating >= 3
        ? 'Feedback is steady, with room to improve the lower-rated experiences.'
        : 'This week shows clear friction points that need attention.'

  return `${canteenName} received ${report.total_reviews} reviews this week. ${topItem} is currently the strongest performer, while ${report.complaint_count} feedback entries were marked as complaints. ${sentiment}`
}

function getTrendMessage(trendData) {
  if (trendData.length < 2) {
    return 'More weekly reviews are needed before a trend can be identified.'
  }

  const first = Number(trendData[0]?.avg_rating || 0)
  const last = Number(trendData[trendData.length - 1]?.avg_rating || 0)
  const delta = Number((last - first).toFixed(2))

  if (delta >= 0.2) {
    return 'Average rating is improving over the tracked period.'
  }

  if (delta <= -0.2) {
    return 'Average rating is declining over the tracked period.'
  }

  return 'Average rating has stayed fairly steady across the tracked weeks.'
}

function MetricCard({ label, value, changeText, positive = true }) {
  return (
    <article className="admin-metric-card">
      <span className="metric-label">{label}</span>
      <strong className="metric-value">{value}</strong>
      <p className={`metric-change ${positive ? 'metric-up' : 'metric-down'}`}>{changeText}</p>
    </article>
  )
}

function RatingBadge({ value }) {
  const numeric = Number(value || 0)
  const tone =
    numeric >= 4.5 ? 'excellent' : numeric >= 3.5 ? 'good' : numeric >= 2.5 ? 'mixed' : 'poor'

  return (
    <span className={`admin-rating-badge admin-rating-badge--${tone}`}>
      <StarRating value={numeric} size={13} />
    </span>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [trendData, setTrendData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionMessage, setActionMessage] = useState('')
  const [busyAction, setBusyAction] = useState('')

  const canteenId = window.sessionStorage.getItem('admin_canteen_id') || 'snackers'
  const token = window.sessionStorage.getItem('admin_token')
  const weekInfo = useMemo(() => getCurrentIsoWeekInfo(), [])
  const canteenName = CANTEEN_NAMES[canteenId] || canteenId
  const weekRange = `Week ${weekInfo.week} - ${weekInfo.startLabel} to ${weekInfo.endLabel}`

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true)
      setError('')

      try {
        const params = new URLSearchParams({
          canteen_id: canteenId,
          week: String(weekInfo.week),
        })

        const trendParams = new URLSearchParams({
          canteen_id: canteenId,
        })

        const [reportResponse, trendResponse] = await Promise.all([
          fetch(`${API_BASE}/admin/report.php?${params.toString()}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API_BASE}/admin/weekly-trend.php?${trendParams.toString()}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ])

        const reportData = await reportResponse.json()
        const trendPayload = await trendResponse.json()

        if (!reportResponse.ok) {
          throw new Error(reportData.message || 'Unable to load weekly report')
        }

        if (!trendResponse.ok) {
          throw new Error(trendPayload.message || 'Unable to load weekly trend')
        }

        setReport(reportData)
        setTrendData(Array.isArray(trendPayload) ? trendPayload : [])
      } catch (requestError) {
        setError(requestError.message || 'Unable to load weekly report')
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [canteenId, token, weekInfo.week])

  const trendMessage = useMemo(() => getTrendMessage(trendData), [trendData])
  const chartData = useMemo(() => {
    const distribution = report?.rating_distribution || {}
    return [1, 2, 3, 4, 5].map((rating, index) => ({
      rating: `${rating} star`,
      count: Number(distribution[String(rating)] || 0),
      fill: CHART_COLORS[index],
    }))
  }, [report])

  async function handleEmailReport() {
    setBusyAction('email')
    setActionMessage('')

    try {
      const response = await fetch(`${API_BASE}/admin/send-report.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ canteen_id: canteenId }),
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to send report')
      }

      setActionMessage(data.message)
    } catch (requestError) {
      setActionMessage(requestError.message || 'Unable to send report')
    } finally {
      setBusyAction('')
    }
  }

  async function handleExportPdf() {
    setBusyAction('pdf')
    setActionMessage('')

    try {
      const params = new URLSearchParams({ canteen_id: canteenId })
      const response = await fetch(`${API_BASE}/admin/export-pdf.php?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        let message = 'Unable to export PDF'
        try {
          const data = await response.json()
          message = data.message || message
        } catch {
          // Ignore JSON parsing failures for binary responses.
        }
        throw new Error(message)
      }

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = downloadUrl
      anchor.download = `${canteenId}-week-${weekInfo.week}-report.pdf`
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      window.URL.revokeObjectURL(downloadUrl)
      setActionMessage('PDF export started.')
    } catch (requestError) {
      setActionMessage(requestError.message || 'Unable to export PDF')
    } finally {
      setBusyAction('')
    }
  }

  function handleLogout() {
    window.sessionStorage.removeItem('admin_token')
    window.sessionStorage.removeItem('admin_canteen_id')
    navigate('/admin', { replace: true })
  }

  return (
    <div className="admin-dashboard-shell">
      <div className="admin-dashboard">
        <div className="admin-topbar">
          <div className="admin-topbar-left">
            <h2>Welcome, {canteenName}</h2>
            <span className="admin-topbar-week">{weekRange}</span>
          </div>
          <button type="button" className="admin-logout-btn" onClick={handleLogout}>
            Sign out
          </button>
        </div>

        {loading ? (
          <div className="admin-panel admin-loading-panel">
            <Spinner />
          </div>
        ) : null}
        {error ? <div className="admin-panel admin-error-panel">{error}</div> : null}

        {!loading && !error && report ? (
          <>
            <section className="admin-metrics-grid">
              <MetricCard label="Total Reviews" value={report.total_reviews} changeText="Weekly review volume" positive />
              <MetricCard
                label="Average Rating"
                value={<RatingBadge value={report.avg_rating} />}
                changeText="Student sentiment this week"
                positive={Number(report.avg_rating || 0) >= 3}
              />
              <MetricCard
                label="Top Rated Item"
                value={report.top_items?.[0]?.item_name || 'No data'}
                changeText="Current standout performer"
                positive
              />
              <MetricCard
                label="Complaint Count"
                value={report.complaint_count}
                changeText="Needs attention"
                positive={false}
              />
            </section>

            <section className="admin-grid admin-grid--two admin-two-col">
              <article className="admin-panel admin-chart-panel">
                <div className="admin-panel-head">
                  <div>
                    <p className="admin-section-kicker">Trend</p>
                    <h2>Rating over time</h2>
                  </div>
                </div>

                <div className="admin-chart-wrap">
                  {trendData.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="week" tickLine={false} axisLine={false} />
                        <YAxis domain={[1, 5]} tickCount={5} tickLine={false} axisLine={false} allowDecimals />
                        <Tooltip formatter={(value) => [<StarRating value={value} size={13} />, 'Avg rating']} />
                        <Line
                          type="monotone"
                          dataKey="avg_rating"
                          stroke="#2563eb"
                          strokeWidth={3}
                          dot={{ r: 4, fill: '#2563eb' }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyState icon="📭" message="Nothing here yet." className="admin-empty-state" />
                  )}
                </div>
                <p className="admin-summary-copy">{trendMessage}</p>
              </article>

              <article className="admin-panel admin-chart-panel">
                <div className="admin-panel-head">
                  <div>
                    <p className="admin-section-kicker">Ratings</p>
                    <h2>Distribution</h2>
                  </div>
                </div>

                <div className="admin-chart-wrap">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="rating" tickLine={false} axisLine={false} />
                      <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                      <Tooltip cursor={{ fill: 'rgba(15, 23, 42, 0.04)' }} />
                      <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                        {chartData.map((entry) => (
                          <Cell key={entry.rating} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </article>
            </section>

            <section className="admin-grid admin-grid--two admin-two-col">
              <article className="admin-panel">
                <div className="admin-panel-head">
                  <div>
                    <p className="admin-section-kicker">Summary</p>
                    <h2>This week at a glance</h2>
                  </div>
                </div>
                <p className="admin-summary-copy">{buildSummary(report, canteenName)}</p>
                <div className="admin-action-row">
                  <button
                    type="button"
                    className="admin-primary-btn"
                    onClick={handleExportPdf}
                    disabled={busyAction === 'pdf'}
                  >
                    {busyAction === 'pdf' ? 'Exporting...' : 'Export PDF'}
                  </button>
                  <button
                    type="button"
                    className="admin-secondary-btn"
                    onClick={handleEmailReport}
                    disabled={busyAction === 'email'}
                  >
                    {busyAction === 'email' ? 'Sending...' : 'Email Report'}
                  </button>
                </div>
                {actionMessage ? <p className="admin-inline-message">{actionMessage}</p> : null}
              </article>
            </section>

            <section className="admin-grid admin-grid--two admin-two-col">
              <article className="admin-panel">
                <div className="admin-panel-head">
                  <div>
                    <p className="admin-section-kicker">Items</p>
                    <h2>Top 5 dishes</h2>
                  </div>
                </div>

                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Item name</th>
                        <th>Review count</th>
                        <th>Avg rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.top_items?.length ? (
                        report.top_items.map((item) => (
                          <tr key={item.item_name}>
                            <td>{item.item_name}</td>
                            <td>{item.review_count}</td>
                            <td>
                              <RatingBadge value={item.avg_rating} />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3">
                            <EmptyState icon="📭" message="Nothing here yet." className="admin-empty-state admin-empty-state--table" />
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </article>

              <article className="admin-panel">
                <div className="admin-panel-head">
                  <div>
                    <p className="admin-section-kicker">Feedback</p>
                    <h2>Recent comments</h2>
                  </div>
                </div>

                <div className="admin-feedback-list">
                  {report.recent_feedback?.length ? (
                    report.recent_feedback.map((entry, index) => (
                      <div
                        className={`admin-feedback-card ${entry.is_complaint ? 'feedback-negative' : 'feedback-positive'}`}
                        key={`${entry.created_at}-${index}`}
                      >
                        <div className="admin-feedback-topline">
                          <StarRating value={entry.rating} size={13} />
                          <span className="feedback-meta">{formatFeedbackDate(entry.created_at)}</span>
                        </div>
                        <p className="feedback-text">&quot;{entry.comment || 'No comment text provided.'}&quot;</p>
                      </div>
                    ))
                  ) : (
                    <div className="feedback-empty">
                      <span>💬</span>
                      <p>No feedback yet this week.</p>
                    </div>
                  )}
                </div>
              </article>
            </section>
          </>
        ) : null}
      </div>
    </div>
  )
}
