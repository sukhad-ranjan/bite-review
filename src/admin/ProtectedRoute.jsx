import { Navigate } from 'react-router-dom'
import { isTokenValid } from './adminAuth'

export default function ProtectedRoute({ children }) {
  const token = window.sessionStorage.getItem('admin_token')

  if (!isTokenValid(token)) {
    window.sessionStorage.removeItem('admin_token')
    window.sessionStorage.removeItem('admin_canteen_id')
    return <Navigate to="/admin" replace />
  }

  return children
}
