import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { authAPI } from '../api/services'

const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const params = new URLSearchParams(location.search)
  const token = params.get('token')

  useEffect(() => {
    if (!token) {
      setStatus({ type: 'error', message: 'Invalid or missing reset token.' })
    }
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)
    if (!token) return
    if (password.length < 6) {
      setStatus({ type: 'error', message: 'Password must be at least 6 characters.' })
      return
    }
    if (password !== confirm) {
      setStatus({ type: 'error', message: 'Passwords do not match.' })
      return
    }

    setLoading(true)
    try {
      const res = await authAPI.resetPassword({ token, password })
      if (res && res.success) {
        setStatus({ type: 'success', message: res.message || 'Password reset successful. Redirecting to login...' })
        setTimeout(() => navigate('/login'), 1500)
      } else {
        setStatus({ type: 'error', message: res?.message || 'Failed to reset password.' })
      }
    } catch (err) {
      setStatus({ type: 'error', message: err?.response?.data?.message || 'Error resetting password.' })
    }
    setLoading(false)
  }

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <section className="section-padding">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset your password</h1>
              <p className="text-gray-600">Enter a new password for your account.</p>
            </div>

            {status && (
              <div className={`mb-4 p-4 rounded-lg ${status.type === 'success' ? 'bg-green-50 border border-green-400 text-green-700' : status.type === 'error' ? 'bg-red-50 border border-red-400 text-red-700' : 'bg-blue-50 border border-blue-400 text-blue-700'}`}>
                <p className="text-sm">{status.message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">New password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-600 focus:outline-none disabled:bg-gray-100"
                  placeholder="New password"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Confirm password</label>
                <input
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-600 focus:outline-none disabled:bg-gray-100"
                  placeholder="Confirm password"
                />
              </div>

              <div className="flex items-center justify-between">
                <button type="button" className="btn-ghost" onClick={() => navigate('/login')}>Back to login</button>
                <button type="submit" disabled={loading} className="btn-primary py-2 px-4 disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save new password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ResetPassword
