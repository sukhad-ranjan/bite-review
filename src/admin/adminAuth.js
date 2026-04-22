function decodeTokenPayload(token) {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
    return JSON.parse(window.atob(padded))
  } catch {
    return null
  }
}

export function isTokenValid(token) {
  if (!token) return false

  const payload = decodeTokenPayload(token)
  if (!payload?.exp) return false

  return payload.exp * 1000 > Date.now()
}
