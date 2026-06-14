'use client'

import { useState, useEffect } from 'react'
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import type { Property } from '@/lib/properties'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '15px',
      color: '#1a1a1a',
      fontFamily: 'system-ui, sans-serif',
      '::placeholder': { color: '#9ca3af' },
    },
    invalid: { color: '#ef4444' },
  },
}

function diffDays(a: string, b: string): number {
  const d1 = new Date(a)
  const d2 = new Date(b)
  return Math.max(0, Math.round((d2.getTime() - d1.getTime()) / 86400000))
}

// ── Inner form (has access to stripe/elements hooks) ──────────────────────────
function CheckoutForm({ property }: { property: Property }) {
  const stripe = useStripe()
  const elements = useElements()

  const today = new Date().toISOString().split('T')[0]

  const [checkIn, setCheckIn]   = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests]     = useState(1)
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [phone, setPhone]       = useState('')
  const [message, setMessage]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState(false)

  const nights = checkIn && checkOut ? diffDays(checkIn, checkOut) : 0
  const total  = nights * property.pricePerNight

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!stripe || !elements) return
    if (nights < 1) { setError('Please select valid check-in and check-out dates.'); return }
    if (!name || !email) { setError('Name and email are required.'); return }

    setLoading(true)

    try {
      // 1. Create PaymentIntent (hold only, no charge)
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertySlug: property.slug,
          checkIn,
          checkOut,
          guests,
          guestName: name,
          guestEmail: email,
          guestPhone: phone,
          message,
          nights,
          totalAmount: total,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create payment intent')

      // 2. Confirm card authorisation (does NOT charge — manual capture later)
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) throw new Error('Card element not found')

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: { name, email, phone },
          },
        }
      )

      if (stripeError) throw new Error(stripeError.message)

      // Status should be 'requires_capture' — money is held, not taken
      if (paymentIntent?.status === 'requires_capture' || paymentIntent?.status === 'succeeded') {
        setSuccess(true)
      } else {
        throw new Error('Unexpected payment status: ' + paymentIntent?.status)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-10 px-6">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: '#e8f4f0' }}
        >
          <svg className="w-8 h-8" style={{ color: '#1f6757' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-serif text-2xl font-semibold text-gray-900 mb-2">Enquiry received</h3>
        <p className="text-gray-600 text-sm mb-4">
          Your payment of <strong>€{total.toLocaleString()}</strong> is securely held — nothing has been charged yet.
          Siam will review your request and confirm within 24 hours. You'll receive a confirmation email once approved.
        </p>
        <p className="text-xs text-gray-400">
          If your booking is not confirmed, the hold is automatically released and you pay nothing.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Date pickers */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Check-in</label>
          <input
            type="date"
            min={today}
            value={checkIn}
            onChange={e => { setCheckIn(e.target.value); if (checkOut && e.target.value >= checkOut) setCheckOut('') }}
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Check-out</label>
          <input
            type="date"
            min={checkIn || today}
            value={checkOut}
            onChange={e => setCheckOut(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
          />
        </div>
      </div>

      {/* Guests */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Guests</label>
        <select
          value={guests}
          onChange={e => setGuests(Number(e.target.value))}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
        >
          {Array.from({ length: property.guests }, (_, i) => i + 1).map(n => (
            <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
          ))}
        </select>
      </div>

      {/* Price summary */}
      {nights > 0 && (
        <div className="rounded-xl p-4 text-sm" style={{ background: '#e8f4f0' }}>
          <div className="flex justify-between text-gray-700 mb-1">
            <span>€{property.pricePerNight} × {nights} night{nights > 1 ? 's' : ''}</span>
            <span>€{total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t border-teal-200">
            <span>Total held (not charged)</span>
            <span>€{total.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Divider */}
      <hr className="border-gray-100" />

      {/* Guest details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Full name *</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            placeholder="Jane Smith"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="jane@example.com"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Phone (optional)</label>
        <input
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="+44 7700 000000"
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Message (optional)</label>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={3}
          placeholder="Any questions or special requests?"
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 resize-none"
        />
      </div>

      {/* Card details */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">Card details</label>
        <div className="border border-gray-200 rounded-lg px-3 py-3 focus-within:ring-2 focus-within:ring-teal-600 focus-within:border-transparent">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          Your card will be held but <strong>not charged</strong> until Siam confirms your booking.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !stripe || nights < 1}
        className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-opacity disabled:opacity-50"
        style={{ background: '#1f6757' }}
      >
        {loading ? 'Processing…' : `Request to book — €${total > 0 ? total.toLocaleString() : '0'} held`}
      </button>

      <p className="text-center text-xs text-gray-400">
        Secured by Stripe · No charge until confirmed · SSL encrypted
      </p>
    </form>
  )
}

// ── Outer wrapper (provides Stripe context) ───────────────────────────────────
export default function BookingForm({ property }: { property: Property }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm property={property} />
    </Elements>
  )
}
