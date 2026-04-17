'use client'

import { useState } from 'react'

type PayMongoPaymentProps = {
  amount: number
  orderNumber: string
  onSuccess: () => void
  onError: (error: string) => void
}

export default function PayMongoPayment({ amount, orderNumber, onSuccess, onError }: PayMongoPaymentProps) {
  const [loading, setLoading] = useState(false)
  const [method, setMethod] = useState<'gcash' | 'paymaya'>('gcash')

  const handlePay = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/payment/paymongo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          method,
          orderNumber,
          description: `Fronda Online Store - Order ${orderNumber}`,
        })
      })

      const data = await res.json()

      if (!res.ok || !data.checkoutUrl) {
        onError(data.error || 'Payment failed. Please try again.')
        return
      }

      // Redirect to PayMongo checkout
      window.open(data.checkoutUrl, '_blank')
      // Mark as success (user will complete on PayMongo page)
      onSuccess()
    } catch (err) {
      onError('Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Select Payment Method</h3>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => setMethod('gcash')}
          className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-colors ${
            method === 'gcash' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-2">
            <span className="text-white font-bold text-sm">GCash</span>
          </div>
          <span className="text-sm font-medium text-gray-900">GCash</span>
          {method === 'gcash' && (
            <span className="text-xs text-blue-600 mt-1">✓ Selected</span>
          )}
        </button>

        <button
          onClick={() => setMethod('paymaya')}
          className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-colors ${
            method === 'paymaya' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-2">
            <span className="text-white font-bold text-xs">PayMaya</span>
          </div>
          <span className="text-sm font-medium text-gray-900">Maya</span>
          {method === 'paymaya' && (
            <span className="text-xs text-green-600 mt-1">✓ Selected</span>
          )}
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex justify-between text-sm text-gray-700 mb-1">
          <span>Order Number:</span>
          <span className="font-medium text-gray-900">{orderNumber}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-700">
          <span>Amount to Pay:</span>
          <span className="font-bold text-gray-900 text-base">₱{amount.toFixed(2)}</span>
        </div>
      </div>

      <div className="text-xs text-gray-500 mb-4 text-center">
        You will be redirected to PayMongo's secure checkout page to complete your payment.
      </div>

      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full py-3 px-4 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Creating Payment Link...
          </>
        ) : (
          `Pay ₱${amount.toFixed(2)} with ${method === 'gcash' ? 'GCash' : 'Maya'}`
        )}
      </button>

      <p className="text-xs text-gray-500 text-center mt-3">
        🔒 Secured by PayMongo · PCI-DSS Compliant
      </p>
    </div>
  )
}
