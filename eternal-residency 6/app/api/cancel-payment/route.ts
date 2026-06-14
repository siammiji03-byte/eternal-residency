import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const adminPassword = req.headers.get('x-admin-password')
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const { paymentIntentId } = await req.json()
    if (!paymentIntentId) {
      return NextResponse.json({ error: 'Missing paymentIntentId' }, { status: 400 })
    }

    const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId)

    return NextResponse.json({ success: true, paymentIntent })
  } catch (err: unknown) {
    console.error('cancel-payment error:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
