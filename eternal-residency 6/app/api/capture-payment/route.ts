import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    // Simple admin password check
    const adminPassword = req.headers.get('x-admin-password')
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const { paymentIntentId } = await req.json()
    if (!paymentIntentId) {
      return NextResponse.json({ error: 'Missing paymentIntentId' }, { status: 400 })
    }

    const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId)

    // Update metadata to mark as confirmed
    await stripe.paymentIntents.update(paymentIntentId, {
      metadata: { ...paymentIntent.metadata, status: 'confirmed' },
    })

    return NextResponse.json({ success: true, paymentIntent })
  } catch (err: unknown) {
    console.error('capture-payment error:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
