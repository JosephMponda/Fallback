import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { authAPI } from '../api/services'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const next = params.get('next') || '/login'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)
    setLoading(true)
    try {
      const res = await authAPI.forgotPassword({ email })
      if (res && res.success) {
        setStatus({ type: 'success', message: res.message || 'If an account exists we sent reset instructions to your email.' })
      } else {
        setStatus({ type: 'info', message: res?.message || 'If an account exists we sent reset instructions to your email.' })
      }
    } catch (err) {
      // Backend may not implement this endpoint. Provide fallback instructions.
      setStatus({ type: 'error', message: 'Unable to contact server to send reset email. You can contact support via message box to request a password reset.' })
    }
    setLoading(false)
  }

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <section className="section-padding">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot your password?</h1>
              <p className="text-gray-600">Enter your account email and we'll send instructions to reset your password.</p>
            </div>

            {status && (
              <div className={`mb-4 p-4 rounded-lg ${status.type === 'success' ? 'bg-green-50 border border-green-400 text-green-700' : status.type === 'error' ? 'bg-red-50 border border-red-400 text-red-700' : 'bg-blue-50 border border-blue-400 text-blue-700'}`}>
                <p className="text-sm">{status.message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-600 focus:outline-none disabled:bg-gray-100"
                  placeholder="your@email.com"
                />
              </div>

              <div className="flex items-center justify-between">
                <button type="button" className="btn-ghost" onClick={() => navigate(next)}>Back</button>
                <button type="submit" disabled={loading} className="btn-primary py-2 px-4 disabled:opacity-50">
                  {loading ? 'Sending...' : 'Send Reset Email'}
                </button>
              </div>
            </form>

            <div className="mt-6 text-sm text-gray-600">
              <p>If you don't receive an email, contact support: <a href="mailto:grandgaze01@gmail.com" className="text-primary-600 hover:underline">info@everestprintingpress.com</a></p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ForgotPassword
