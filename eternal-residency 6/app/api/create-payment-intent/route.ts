import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getPropertyBySlug } from '@/lib/properties'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      propertySlug,
      checkIn,
      checkOut,
      guests,
      guestName,
      guestEmail,
      guestPhone,
      message,
      nights,
      totalAmount,
    } = body

    if (!propertySlug || !checkIn || !checkOut || !guestName || !guestEmail || !nights) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const property = getPropertyBySlug(propertySlug)
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    // Amount in cents (EUR)
    const amount = Math.round(totalAmount * 100)

    // Create PaymentIntent with manual capture — this holds the card but does NOT charge it.
    // Siam must explicitly capture the payment to release funds.
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      capture_method: 'manual',   // ← KEY: hold only, no immediate charge
      payment_method_types: ['card'],
      metadata: {
        propertySlug,
        propertyName: property.name,
        checkIn,
        checkOut,
        guests: String(guests),
        nights: String(nights),
        guestName,
        guestEmail,
        guestPhone: guestPhone || '',
        message: message || '',
        status: 'pending',        // pending | confirmed | declined
      },
      description: `Enquiry: ${property.name} | ${checkIn} → ${checkOut} (${nights} nights) | ${guestName}`,
      receipt_email: guestEmail,
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err: unknown) {
    console.error('create-payment-intent error:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
