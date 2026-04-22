function Spinner({ className = '' }) {
  return (
    <div className={`spinner-wrapper ${className}`.trim()}>
      <div className="spinner" aria-label="Loading"></div>
      <p className="spinner-text">Loading report...</p>
    </div>
  )
}

export default Spinner
