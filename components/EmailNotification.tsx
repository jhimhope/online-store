'use client'

import { Mail, CheckCircle } from 'lucide-react'
import { useState } from 'react'

type EmailNotificationProps = {
  orderNumber: string
  customerEmail: string
  totalAmount: number
}

export default function EmailNotification({ orderNumber, customerEmail, totalAmount }: EmailNotificationProps) {
  const [emailSent, setEmailSent] = useState(false)

  const handleSendEmail = () => {
    // Simulate sending email
    setTimeout(() => {
      setEmailSent(true)
    }, 1000)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <Mail className="h-6 w-6 text-gray-500 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">Email Notification</h3>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">
            Order confirmation email will be sent to:
          </p>
          <p className="font-medium text-gray-900">{customerEmail}</p>
        </div>

        <div className="p-4 bg-blue-50 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Email will include order details, tracking information, and receipt.
              </p>
            </div>
          </div>
        </div>

        {emailSent ? (
          <div className="p-4 bg-green-50 rounded-md">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-sm text-green-700">
                Confirmation email sent successfully!
              </p>
            </div>
          </div>
        ) : (
          <button
            onClick={handleSendEmail}
            className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Send Test Email
          </button>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Email Preview</h4>
        <div className="bg-gray-50 p-4 rounded-md text-sm">
          <p className="font-medium">Order Confirmation #{orderNumber}</p>
          <p className="text-gray-600 mt-1">Thank you for your order!</p>
          <p className="text-gray-600 mt-1">Total: ${totalAmount.toFixed(2)}</p>
          <p className="text-gray-600 mt-1">We'll notify you when your order ships.</p>
        </div>
      </div>
    </div>
  )
}