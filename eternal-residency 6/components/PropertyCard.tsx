import Image from 'next/image'
import Link from 'next/link'
import type { Property } from '@/lib/properties'

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={property.images[0]}
          alt={property.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />
        {property.badge && (
          <span
            className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full text-white"
            style={{ background: '#1f6757' }}
          >
            {property.badge}
          </span>
        )}
        {property.type === 'entire' && (
          <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 text-gray-800">
            Entire place
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-serif font-semibold text-gray-900 text-lg mb-1 leading-tight group-hover:text-teal-700 transition-colors">
          {property.name}
        </h3>
        <p className="text-gray-500 text-xs mb-3">{property.address}</p>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{property.shortDesc}</p>

        {/* Stats row */}
        <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
          <span>{property.guests} guests</span>
          <span>·</span>
          <span>{property.bedrooms} bed{property.bedrooms !== 1 ? 'rooms' : 'room'}</span>
          <span>·</span>
          <span>{property.bathrooms} bath{property.bathrooms !== 1 ? 'rooms' : 'room'}</span>
        </div>

        {/* Price + rating */}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-gray-900 text-base">€{property.pricePerNight}</span>
            <span className="text-gray-400 text-xs ml-1">/ night</span>
          </div>
          {property.reviewCount > 0 && (
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs font-medium text-gray-700">{property.rating.toFixed(2)}</span>
              <span className="text-xs text-gray-400">({property.reviewCount})</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
