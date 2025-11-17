import React, { useState, useEffect } from 'react'
import { servicesAPI, quotesAPI } from '../api/services'

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

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loadingServices, setLoadingServices] = useState(true)

  useEffect(() => {
    loadServices()
  }, [])

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
      // Submit as a quote request
      await quotesAPI.create(formData)
      setSubmitted(true)
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        serviceType: '',
        description: '',
        budget: ''
      })
      setTimeout(() => setSubmitted(false), 10000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

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
              <p>We'll contact you shortly with a detailed quote. A confirmation email has been sent to {formData.customerEmail}.</p>
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
                  <label className="block text-gray-700 font-semibold mb-2">Budget (Optional)</label>
                  <input
                    type="number"
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

              <div className="mt-8 bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-3">Payment Methods</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-gray-900">Airtel Money</p>
                    <p className="text-gray-600">+265 999 411 680</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">TNM Mpamba</p>
                    <p className="text-gray-600">+265 888 891 819</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Bank Transfer</p>
                    <p className="text-gray-600">Standard Bank</p>
                  </div>
                </div>
              </div>

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
