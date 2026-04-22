function EmptyState({ icon = '📭', message, className = '' }) {
  return (
    <div className={`empty-state ${className}`.trim()}>
      <span className="empty-state-icon">{icon}</span>
      <p>{message}</p>
    </div>
  )
}

export default EmptyState
