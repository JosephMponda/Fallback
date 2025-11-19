import React, { useState, useEffect } from 'react'
import { servicesAPI, quotesAPI } from '../api/services'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Order = () => {
  const [services, setServices] = useState([])
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    serviceType: '',
    description: '',
    budget: ''
  })

  const [currencyCode, setCurrencyCode] = useState('USD')
  const [locale, setLocale] = useState('en-US')
  const [lastSubmittedEmail, setLastSubmittedEmail] = useState('')

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loadingServices, setLoadingServices] = useState(true)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    loadServices()
    detectCurrency()
    // If user returned from login and there's a pending quote, try auto-submit
    const pending = sessionStorage.getItem('pendingQuote')
    if (pending) {
      try {
        const data = JSON.parse(pending)
        setFormData((f) => ({ ...f, ...data }))
      } catch (e) {
        // ignore
      }
    }
  }, [])

  // detect currency from browser locale (fallback to USD)
  const detectCurrency = () => {
    // Try to robustly detect user's locale/region. Prefer Intl resolved locale,
    // then navigator.languages, then fallback to navigator.language. If still
    // unknown, try timezone heuristics (useful when browser locale is generic)
    const resolvedLocale = (Intl.NumberFormat && Intl.NumberFormat().resolvedOptions && Intl.NumberFormat().resolvedOptions().locale) ||
      (Intl.DateTimeFormat && Intl.DateTimeFormat().resolvedOptions && Intl.DateTimeFormat().resolvedOptions().locale) ||
      (navigator.languages && navigator.languages[0]) ||
      navigator.language ||
      'en-US'

    setLocale(resolvedLocale)

    // extract region code from locales like en-MW or en-GB
    let region = null
    const tryExtractRegion = (loc) => {
      if (!loc) return null
      const m = loc.match(/-([A-Za-z]{2,3})$/)
      return m ? m[1].toUpperCase() : null
    }

    region = tryExtractRegion(resolvedLocale)
    if (!region && navigator.languages) {
      for (const l of navigator.languages) {
        region = tryExtractRegion(l)
        if (region) break
      }
    }

    // Map some well-known timezones to country codes (helpful if locale lacks region)
    if (!region) {
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
        const tzMap = {
          'Africa/Blantyre': 'MW',
          'Africa/Harare': 'ZW',
          'Africa/Johannesburg': 'ZA',
          'Europe/London': 'GB',
        }
        if (tzMap[tz]) region = tzMap[tz]
      } catch (e) {
        // ignore
      }
    }

    const map = {
      MW: 'MWK', // Malawi
      ZW: 'ZWL',
      US: 'USD',
      GB: 'GBP',
      KE: 'KES',
      ZA: 'ZAR',
      NG: 'NGN',
      TZ: 'TZS',
      ZM: 'ZMW',
      EU: 'EUR',
      AU: 'AUD',
    }

    // default: if we detected nothing, prefer MWK when timezone/locale hints at Africa/Blantyre
    setCurrencyCode(map[region] || 'USD')
  }

  const loadServices = async () => {
    try {
      const response = await servicesAPI.getAll(true)
      setServices(response.data.services)
    } catch (err) {
      console.error('Error loading services:', err)
    } finally {
      setLoadingServices(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // If user not logged in, save the pending quote and redirect to login
      if (!isAuthenticated) {
        sessionStorage.setItem('pendingQuote', JSON.stringify(formData))
        // attach locale/currency as well so the backend can format emails
        sessionStorage.setItem('pendingQuoteMeta', JSON.stringify({ currencyCode, locale }))
        navigate('/login?next=/order')
        return
      }

      // build payload: ensure budget is numeric (or undefined)
      const cleanBudget = formData.budget ? Number(formData.budget.toString().replace(/[^0-9.-]+/g, '')) : undefined
      const payload = {
        ...formData,
        budget: typeof cleanBudget === 'number' && !Number.isNaN(cleanBudget) ? cleanBudget : undefined,
        currency: currencyCode,
      }

      const res = await quotesAPI.create(payload)

      // navigate to payment page and pass the created quote (or payload) for payment
      // Note: backend quote may not store `currency`, so prefer the returned
      // quote object but fall back to the payload and ensure currency is set.
      const quoteData = (res && typeof res === 'object') ? res : payload
      if (!quoteData.currency) quoteData.currency = payload.currency
      // clear any pending quote now that it was created
      sessionStorage.removeItem('pendingQuote')
      sessionStorage.removeItem('pendingQuoteMeta')

      // navigate to payment page
      navigate('/payment', { state: { quote: quoteData } })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    // allow changing currency selection via same handler
    if (name === 'currency') {
      setCurrencyCode(value)
      return
    }

    // special-case budget: format with locale-aware thousands separators while typing
    if (name === 'budget') {
      // allow digits and decimal point; strip all other characters
      const cleaned = value.replace(/[^0-9.]/g, '')

      // if empty or just a dot, set raw value
      if (cleaned === '' || cleaned === '.') {
        setFormData({ ...formData, budget: cleaned })
        return
      }

      // parse to number then format with Intl.NumberFormat using detected locale
      const num = Number(cleaned)
      if (Number.isNaN(num)) {
        setFormData({ ...formData, budget: '' })
        return
      }

      try {
        const formatted = new Intl.NumberFormat(locale || undefined).format(num)
        setFormData({ ...formData, budget: formatted })
      } catch (err) {
        // fallback simple comma formatting
        const fallback = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        setFormData({ ...formData, budget: fallback })
      }
      return
    }

    setFormData({ ...formData, [name]: value })
  }

  // If user just logged in and there is a pending quote, auto-submit it

  useEffect(() => {
    const pending = sessionStorage.getItem('pendingQuote')
    if (pending && isAuthenticated) {
      try {
        const data = JSON.parse(pending)
        const meta = JSON.parse(sessionStorage.getItem('pendingQuoteMeta') || '{}')
        setFormData((f) => ({ ...f, ...data }))
        if (meta.currencyCode) setCurrencyCode(meta.currencyCode)
        if (meta.locale) setLocale(meta.locale)

        // submit after a tick so states are applied
        setTimeout(async () => {
          try {
            const cleanPendingBudget = data.budget ? Number(data.budget.toString().replace(/[^0-9.-]+/g, '')) : undefined
            const payload = {
              ...data,
              budget: typeof cleanPendingBudget === 'number' && !Number.isNaN(cleanPendingBudget) ? cleanPendingBudget : undefined,
              currency: meta.currencyCode || currencyCode,
            }
            const res = await quotesAPI.create(payload)
            const quoteData = (res && typeof res === 'object') ? res : payload
            if (!quoteData.currency) quoteData.currency = payload.currency
            sessionStorage.removeItem('pendingQuote')
            sessionStorage.removeItem('pendingQuoteMeta')
            // navigate to payment page
            navigate('/payment', { state: { quote: quoteData } })
          } catch (e) {
            console.error('Auto-submit pending quote failed', e)
          }
        }, 300)
      } catch (e) {
        // ignore
      }
    }
  }, [isAuthenticated])

  return (
    <div className="pt-24">
      <section className="section-padding bg-gradient-to-br from-primary-900 to-primary-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Request a Quote</h1>
          <p className="text-xl">Fill out the form below and we'll get back to you with a quote within 24 hours</p>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="max-w-4xl mx-auto">
          {submitted && (
            <div className="mb-8 p-6 bg-green-100 border-2 border-green-500 rounded-lg text-green-800 text-center">
              <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="font-bold text-lg">Quote Request Submitted Successfully!</p>
              <p>We'll contact you shortly with a detailed quote. A confirmation email has been sent to {lastSubmittedEmail || formData.customerEmail}.</p>
            </div>
          )}

          {error && (
            <div className="mb-8 p-6 bg-red-100 border-2 border-red-500 rounded-lg text-red-800 text-center">
              <p className="font-bold text-lg">Error</p>
              <p>{error}</p>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="customerName"
                    required
                    value={formData.customerName}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-600 focus:outline-none disabled:bg-gray-100"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                  <input
                    type="email"
                    name="customerEmail"
                    required
                    value={formData.customerEmail}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-600 focus:outline-none disabled:bg-gray-100"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="customerPhone"
                    required
                    value={formData.customerPhone}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-600 focus:outline-none disabled:bg-gray-100"
                    placeholder="+265 999 411 680"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Service Required *</label>
                  {loadingServices ? (
                    <div className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100">
                      Loading services...
                    </div>
                  ) : (
                    <select
                      name="serviceType"
                      required
                      value={formData.serviceType}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-600 focus:outline-none disabled:bg-gray-100"
                    >
                      <option value="">Select a service</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.name}>
                          {service.name}
                        </option>
                      ))}
                      <option value="Offset Printing">Offset Printing</option>
                      <option value="Screen Printing">Screen Printing</option>
                      <option value="Banner Printing">Banner Printing</option>
                      <option value="Video Production">Video Production</option>
                      <option value="Design Services">Design Services</option>
                      <option value="Digital Printing">Digital Printing</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Currency *</label>
                  <select
                    name="currency"
                    value={currencyCode}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-600 focus:outline-none disabled:bg-gray-100"
                  >
                    <option value="MWK">MWK - Malawian Kwacha</option>
                    <option value="ZWL">ZWL - Zimbabwe Dollar</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="KES">KES - Kenyan Shilling</option>
                    <option value="ZAR">ZAR - South African Rand</option>
                    <option value="NGN">NGN - Nigerian Naira</option>
                    <option value="TZS">TZS - Tanzanian Shilling</option>
                    <option value="ZMW">ZMW - Zambian Kwacha</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Budget (Optional)</label>
                  <input
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-600 focus:outline-none disabled:bg-gray-100"
                    placeholder="5000"
                    min="0"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2">Project Description *</label>
                  <textarea
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleChange}
                    disabled={loading}
                    rows="5"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-600 focus:outline-none disabled:bg-gray-100"
                    placeholder="Please describe your project requirements, specifications, colors, size, quantity, etc."
                  ></textarea>
                </div>
              </div>

              <div className="mt-8 bg-primary-50 border-2 border-primary-200 rounded-lg p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-3">What Happens Next?</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">1.</span>
                    <span>We review your request and prepare a detailed quote</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">2.</span>
                    <span>You'll receive the quote via email within 24 hours</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">3.</span>
                    <span>Upon approval, we'll send payment instructions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">4.</span>
                    <span>50% deposit required before production starts</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">5.</span>
                    <span>Balance due upon completion</span>
                  </li>
                </ul>
              </div>

              {/* Payment methods moved to a separate Payment page */}

              <button
                type="submit"
                disabled={loading}
                className="mt-8 w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Quote Request'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Order
