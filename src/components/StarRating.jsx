function StarRating({ value, max = 5, size = 14, className = '' }) {
  const numVal = Number(value) || 0

  return (
    <span
      className={`star-rating ${className}`.trim()}
      aria-label={`${numVal.toFixed(1)} out of ${max} stars`}
      style={{ fontSize: size }}
    >
      {Array.from({ length: max }, (_, index) => {
        const full = index + 1 <= Math.floor(numVal)
        const half = !full && index < numVal

        return (
          <span
            key={index}
            className="star-rating__star"
            style={{ color: full || half ? '#f59e0b' : '#d1d5db' }}
          >
            {full ? '★' : half ? '⯨' : '☆'}
          </span>
        )
      })}
      <span
        className="star-rating__value"
        style={{
          fontSize: size - 2,
          color: '#6b7280',
          marginLeft: 6,
          fontWeight: 500,
        }}
      >
        {numVal.toFixed(1)}
      </span>
    </span>
  )
}

export default StarRating
