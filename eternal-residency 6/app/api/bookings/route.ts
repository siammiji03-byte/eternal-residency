import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

// Fetch all pending/confirmed bookings from Stripe PaymentIntents
export async function GET(req: NextRequest) {
  try {
    const adminPassword = req.headers.get('x-admin-password')
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    // Fetch requires_capture (held) and succeeded (captured) intents
    const [requiresCapture, succeeded] = await Promise.all([
      stripe.paymentIntents.list({ limit: 100 }),
      stripe.paymentIntents.list({ limit: 100 }),
    ])

    // Combine and filter to only our booking intents (those with propertySlug in metadata)
    const all = requiresCapture.data.filter(
      (pi) => pi.metadata?.propertySlug && pi.status !== 'canceled'
    )

    const bookings = all.map((pi) => ({
      id: pi.id,
      status: pi.status,
      amount: pi.amount,
      currency: pi.currency,
      metadata: pi.metadata,
      created: pi.created,
    }))

    return NextResponse.json({ bookings })
  } catch (err: unknown) {
    console.error('bookings error:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
