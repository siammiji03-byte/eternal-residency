'use client'

import { useState, useEffect, useCallback } from 'react'

type Booking = {
  id: string
  status: string
  amount: number
  currency: string
  created: number
  metadata: {
    propertyName: string
    guestName: string
    guestEmail: string
    guestPhone: string
    checkIn: string
    checkOut: string
    guests: string
    nights: string
    message: string
    status: string
  }
}

function statusBadge(stripeStatus: string, metaStatus: string) {
  if (stripeStatus === 'succeeded') return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">Confirmed &amp; paid</span>
  if (stripeStatus === 'canceled') return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">Declined</span>
  if (stripeStatus === 'requires_capture') return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Awaiting confirmation</span>
  return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">{stripeStatus}</span>
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed]     = useState(false)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [actionId, setActionId] = useState<string | null>(null)

  const fetchBookings = useCallback(async (pwd: string) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/bookings', { headers: { 'x-admin-password': pwd } })
      if (res.status === 401) { setError('Wrong password'); setAuthed(false); return }
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setBookings(data.bookings || [])
      setAuthed(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }, [])

  async function handleAction(id: string, action: 'capture' | 'cancel') {
    setActionId(id)
    try {
      const endpoint = action === 'capture' ? '/api/capture-payment' : '/api/cancel-payment'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ paymentIntentId: id }),
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error || 'Action failed')
      await fetchBookings(password)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Action failed')
    } finally {
      setActionId(null)
    }
  }

  return (
    <div className="min-h-screen py-16 px-4 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-1">Admin — Bookings</h1>
        <p className="text-gray-500 text-sm">Confirm or decline pending payment holds.</p>
      </div>

      {!authed ? (
        <div className="max-w-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">Admin password</label>
          <div className="flex gap-2">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchBookings(password)}
              placeholder="Enter password"
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
            <button
              onClick={() => fetchBookings(password)}
              className="px-5 py-2.5 rounded-lg text-white text-sm font-medium"
              style={{ background: '#1f6757' }}
            >
              Login
            </button>
          </div>
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">{bookings.length} booking{bookings.length !== 1 ? 's' : ''} found</p>
            <button
              onClick={() => fetchBookings(password)}
              className="text-sm px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Refresh
            </button>
          </div>

          {error && <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}

          {loading ? (
            <p className="text-gray-500 text-sm">Loading…</p>
          ) : bookings.length === 0 ? (
            <p className="text-gray-400 text-sm">No bookings yet.</p>
          ) : (
            <div className="space-y-4">
              {bookings
                .sort((a, b) => b.created - a.created)
                .map(b => (
                  <div key={b.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{b.metadata.propertyName}</h3>
                          {statusBadge(b.status, b.metadata.status)}
                        </div>
                        <p className="text-xs text-gray-400">ID: {b.id}</p>
                        <p className="text-xs text-gray-400">Received: {new Date(b.created * 1000).toLocaleString()}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-2xl font-bold text-gray-900">
                          {(b.amount / 100).toLocaleString('en-GB', { style: 'currency', currency: b.currency.toUpperCase() })}
                        </p>
                        <p className="text-xs text-gray-400">
                          {b.metadata.nights} night{Number(b.metadata.nights) !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm mb-4">
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Guest</p>
                        <p className="font-medium text-gray-800">{b.metadata.guestName}</p>
                        <p className="text-gray-500 text-xs">{b.metadata.guestEmail}</p>
                        {b.metadata.guestPhone && <p className="text-gray-500 text-xs">{b.metadata.guestPhone}</p>}
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Dates</p>
                        <p className="font-medium text-gray-800">{b.metadata.checkIn}</p>
                        <p className="text-gray-500 text-xs">→ {b.metadata.checkOut}</p>
                        <p className="text-gray-500 text-xs">{b.metadata.guests} guest{Number(b.metadata.guests) !== 1 ? 's' : ''}</p>
                      </div>
                      {b.metadata.message && (
                        <div className="col-span-2 sm:col-span-1">
                          <p className="text-xs text-gray-400 mb-0.5">Message</p>
                          <p className="text-gray-700 text-xs leading-relaxed">{b.metadata.message}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions — only show if awaiting capture */}
                    {b.status === 'requires_capture' && (
                      <div className="flex gap-3 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => handleAction(b.id, 'capture')}
                          disabled={actionId === b.id}
                          className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium disabled:opacity-50"
                          style={{ background: '#1f6757' }}
                        >
                          {actionId === b.id ? 'Processing…' : '✓ Confirm booking & charge'}
                        </button>
                        <button
                          onClick={() => handleAction(b.id, 'cancel')}
                          disabled={actionId === b.id}
                          className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          ✕ Decline &amp; release hold
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
