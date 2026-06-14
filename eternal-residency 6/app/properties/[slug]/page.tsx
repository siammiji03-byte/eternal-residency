import { notFound } from 'next/navigation'
import Image from 'next/image'
import { properties, getPropertyBySlug } from '@/lib/properties'
import BookingForm from '@/components/BookingForm'
import type { Metadata } from 'next'

type Props = { params: { slug: string } }

export async function generateStaticParams() {
  return properties.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const property = getPropertyBySlug(params.slug)
  if (!property) return {}
  return {
    title: `${property.name} | Eternal Residency – Direct Booking`,
    description: property.shortDesc,
    openGraph: { images: [property.images[0]] },
  }
}

export default function PropertyPage({ params }: Props) {
  const property = getPropertyBySlug(params.slug)
  if (!property) notFound()

  const amenityIcons: Record<string, string> = {
    'WiFi': '📶', 'Air conditioning': '❄️', 'Kitchen': '🍳', 'Shared kitchen': '🍳',
    'Smart TV': '📺', 'Smart TV (×4)': '📺', 'Washing machine': '🫧',
    'Hairdryer': '💨', 'Fridge': '🧊', 'Microwave': '📡', 'Bath': '🛁',
    'In-room safe': '🔐', 'Lock on bedroom door': '🔑', 'Self check-in': '🗝️',
    'Security camera (entrance)': '📷', 'Dedicated workspace': '💼',
    'Smoke alarm': '🚨', 'Sofa bed': '🛋️',
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Title */}
      <div className="mb-6">
        <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">{property.name}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
          {property.reviewCount > 0 && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <strong>{property.rating.toFixed(2)}</strong>
              <span>({property.reviewCount} reviews)</span>
            </span>
          )}
          <span>·</span>
          <span>{property.address}</span>
          {property.badge && (
            <>
              <span>·</span>
              <span
                className="px-2 py-0.5 rounded-full text-xs font-semibold text-white"
                style={{ background: '#1f6757' }}
              >
                {property.badge}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Photo grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-10 rounded-2xl overflow-hidden">
        {property.images.map((img, i) => (
          <div key={i} className={`relative ${i === 0 ? 'col-span-2 md:col-span-2 row-span-2 h-80 md:h-96' : 'h-40 md:h-44'}`}>
            <Image src={img} alt={`${property.name} photo ${i + 1}`} fill className="object-cover" unoptimized />
          </div>
        ))}
      </div>

      {/* Two columns: details + booking */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Left — property details */}
        <div className="lg:col-span-3 space-y-8">
          {/* Quick stats */}
          <div className="flex flex-wrap gap-4 pb-6 border-b border-gray-100 text-sm">
            {[
              { label: 'guests', value: property.guests },
              { label: 'bedroom' + (property.bedrooms !== 1 ? 's' : ''), value: property.bedrooms },
              { label: 'bed' + (property.beds !== 1 ? 's' : ''), value: property.beds },
              { label: 'bathroom' + (property.bathrooms !== 1 ? 's' : ''), value: property.bathrooms },
            ].map(s => (
              <div key={s.label} className="flex flex-col">
                <span className="text-2xl font-bold text-gray-900">{s.value}</span>
                <span className="text-gray-500 text-xs">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <h2 className="font-serif text-2xl font-semibold mb-4">About this place</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{property.description}</p>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="font-serif text-2xl font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 gap-2">
              {property.amenities.map(a => (
                <div key={a} className="flex items-center gap-2 text-sm text-gray-700">
                  <span>{amenityIcons[a] || '✓'}</span>
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </div>

          {/* House rules */}
          <div>
            <h2 className="font-serif text-2xl font-semibold mb-4">House rules</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Check-in after {property.checkIn}</li>
              <li>Check-out before {property.checkOut}</li>
              <li>Maximum {property.guests} guest{property.guests !== 1 ? 's' : ''}</li>
              <li>No smoking inside the property</li>
              <li>Self check-in via keypad — code provided before arrival</li>
            </ul>
          </div>

          {/* Restaurant discount */}
          <div className="rounded-xl p-5 border" style={{ background: '#f3f8f6', borderColor: '#c5e0d8' }}>
            <h3 className="font-semibold text-gray-900 mb-2">🍽️ Exclusive 20% dining discount</h3>
            <p className="text-sm text-gray-600">Guests enjoy 20% off at three local restaurants: La Grotta Azzurra, Ristorante Alfiero, and Labicana 12.</p>
          </div>
        </div>

        {/* Right — booking form */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-2xl font-bold text-gray-900">€{property.pricePerNight}</span>
              <span className="text-gray-400 text-sm">/ night</span>
            </div>
            <p className="text-xs text-gray-400 mb-6">Direct booking — no service fee</p>

            <BookingForm property={property} />
          </div>
        </div>
      </div>
    </div>
  )
}
