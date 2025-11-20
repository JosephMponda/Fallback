import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AirtelLogo from '../assets/Airtel-logo.svg'
import TnmLogo from '../assets/TNM-logo.svg'
import NationalBankLogo from '../assets/National-Bank-logo.svg'

const copy = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (e) {
    return false
  }
}

const getTelHref = (code) => `tel:${encodeURIComponent(code)}`

const Payment = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const quote = state?.quote || {}

  const formatAmount = (amount, currency) => {
    if (amount === undefined || amount === null || amount === '') return null
    const num = Number(amount)
    if (Number.isNaN(num)) return null

    try {
      const locale = (state?.meta?.locale) || navigator.language || 'en-US'
      const currencyCode = (currency || 'USD').toUpperCase()
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(num)
    } catch (e) {
      return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ' + (currency || '')
    }
  }

  const formattedAmount = formatAmount(quote?.budget, quote?.currency)

  const handleBack = () => navigate(-1)

  return (
    <div className="pt-24">
      <section className="section-padding bg-gradient-to-br from-primary-900 to-primary-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Pay Deposit / Make Payment</h1>
          <p className="text-lg">Use one of the methods below to pay the required deposit. Use the reference: <strong>{quote?.id || quote?.reference || 'QUOTE'}</strong></p>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Quote Summary</h2>
            <p className="text-sm text-gray-600">Name: {quote?.customerName || quote?.name /*|| '—'*/}</p>
            <p className="text-sm text-gray-600">Email: {quote?.customerEmail || quote?.email /*|| '—'*/}</p>
            <p className="text-sm text-gray-600">Service: {quote?.serviceType /*|| '—'*/}</p>
            <p className="text-sm text-gray-600">Amount: {formattedAmount || 'Contact for amount'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border rounded-lg flex flex-col items-start">
              <div className="mb-3">
                <img src={AirtelLogo} alt="Airtel Money" width={48} height={48} className="w-12 h-12 object-contain" />
              </div>
              <h3 className="font-semibold">Airtel Money</h3>
              <p className="text-sm text-gray-600">Account No:</p>
              <p className="text-sm text-gray-600">+265 999 411 680</p>
              <p className="text-sm  text-gray-600">Name: Gerald Mponda</p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={async () => { await copy('+265 999 411 680') }}
                  className="btn-secondary"
                >Copy</button>
                <a
                  href={getTelHref('*211#')}
                  className="btn-primary"
                >Dial</a>
              </div>
            </div>

            <div className="p-4 border rounded-lg flex flex-col items-start">
              <div className="mb-3">
                <img src={TnmLogo} alt="TNM Mpamba" width={48} height={48} className="w-12 h-12 object-contain" />
              </div>
              <h3 className="font-semibold">TNM Mpamba</h3>
              <p className="text-sm text-gray-600">Account No:</p>
              <p className="text-sm text-gray-600">+265 888 891 819</p>
              <p className="text-sm  text-gray-600">Name: Gerald Mponda</p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={async () => { await copy('+265 888 891 819') }}
                  className="btn-secondary"
                >Copy</button>
                <a
                  href={getTelHref('*444#')}
                  className="btn-primary"
                >Dial</a>
              </div>
            </div>

            <div className="p-4 border rounded-lg flex flex-col items-start">
              <div className="mb-3">
                <img src={NationalBankLogo} alt="National Bank" width={48} height={48} className="w-12 h-12 object-contain" />
              </div>
              <h3 className="font-semibold">Bank Transfer</h3>
              <h3 className="font-semibold">(National Bank)</h3>
              <p className="text-sm text-gray-600">Account No: 1001688703</p>
              <p className="text-sm text-gray-600">Name: Everest Printing</p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={async () => { await copy('1001688703') }}
                  className="btn-secondary"
                >Copy</button>
                <a
                  href={getTelHref('*626#')}
                  className="btn-primary"
                >Dial</a>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <button onClick={handleBack} className="btn-ghost">Back</button>
            <a className="btn-primary" href="mailto:grandgaze01@gmail.com?subject=PaymentConfirmation">Email Us Payment Details</a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Payment
