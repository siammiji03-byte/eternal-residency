import Image from 'next/image'
import Link from 'next/link'
import PropertyCard from '@/components/PropertyCard'
import { properties } from '@/lib/properties'

const entireProperties = properties.filter(p => p.type === 'entire')
const roomProperties   = properties.filter(p => p.type === 'room')

export default function HomePage() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative h-[92vh] min-h-[600px] flex items-end">
        <Image
          src="https://a0.muscache.com/im/pictures/miso/Hosting-1106493070534334005/original/d00f05c1-87fc-402b-8513-d657d28802a8.jpeg?im_w=1920"
          alt="Eternal Residency Rome"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full pb-20">
          <p className="text-white/80 text-sm font-medium tracking-widest uppercase mb-3">Rome, Italy</p>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight mb-6">
            Eternal<br />Residency
          </h1>
          <p className="text-white/80 text-lg max-w-lg mb-8 leading-relaxed">
            Luxury apartments and private rooms in the heart of Rome. Book direct for the best rate — no booking fees.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="#properties"
              className="inline-block px-8 py-4 rounded-full text-white font-semibold text-sm text-center transition-opacity hover:opacity-90"
              style={{ background: '#1f6757' }}
            >
              View all properties
            </a>
            <a
              href="#about"
              className="inline-block px-8 py-4 rounded-full text-white font-semibold text-sm text-center bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
            >
              About the host
            </a>
          </div>
        </div>
      </section>

      {/* ── Why book direct ──────────────────────────────────────────────── */}
      <section className="py-16" style={{ background: '#1f6757' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-white text-center">
            {[
              { icon: '💰', title: 'No platform fees', desc: 'Book direct and skip Airbnb service charges — same quality, lower cost.' },
              { icon: '🔒', title: 'Secure payment hold', desc: 'Your card is authorised but nothing is charged until your booking is confirmed.' },
              { icon: '💬', title: 'Direct with your host', desc: 'Communicate straight with Siam, London-based Superhost with 947 reviews.' },
            ].map(item => (
              <div key={item.title}>
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Entire properties ─────────────────────────────────────────────── */}
      <section id="properties" className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <p className="text-sm font-medium tracking-widest uppercase mb-2" style={{ color: '#1f6757' }}>Entire apartments</p>
          <h2 className="font-serif text-4xl font-bold text-gray-900">Have the place to yourself</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {entireProperties.map(p => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </section>

      {/* ── Individual rooms ──────────────────────────────────────────────── */}
      <section id="rooms" className="py-10 pb-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <p className="text-sm font-medium tracking-widest uppercase mb-2" style={{ color: '#1f6757' }}>Private rooms</p>
          <h2 className="font-serif text-4xl font-bold text-gray-900">Your own space in a shared apartment</h2>
          <p className="text-gray-500 mt-2">Each room has a private ensuite and lock — shared kitchen only.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {roomProperties.map(p => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </section>

      {/* ── Locations ────────────────────────────────────────────────────── */}
      <section id="locations" className="py-20" style={{ background: '#f3f8f6' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-12 text-center">
            <p className="text-sm font-medium tracking-widest uppercase mb-2" style={{ color: '#1f6757' }}>Two locations</p>
            <h2 className="font-serif text-4xl font-bold text-gray-900">Both in the heart of Rome</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Termini */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="relative h-52">
                <Image
                  src="https://a0.muscache.com/im/pictures/miso/Hosting-1106509289930308491/original/fd4c98d9-8e05-48bd-a787-4e50228fc62f.jpeg?im_w=720"
                  alt="Termini location"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl font-semibold mb-2">Termini Station area</h3>
                <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                  Via Filippo Turati — 2 minutes from Roma Termini, Rome's main transit hub. Direct access to the Colosseum, Trevi Fountain, and beyond.
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  {['4-bed entire apartment', 'Rooms 1–4', 'Private ensuites'].map(t => (
                    <span key={t} className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* San Giovanni */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="relative h-52">
                <Image
                  src="https://a0.muscache.com/im/pictures/miso/Hosting-1425250900916848665/original/240e8736-9886-4202-8eaf-416252407501.jpeg?im_w=720"
                  alt="San Giovanni location"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl font-semibold mb-2">San Giovanni</h3>
                <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                  Via Albalonga 7 — 3 minutes from Re di Roma metro. A vibrant neighbourhood rich with local restaurants, markets, and authentic Roman life.
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  {['2-bed entire apartment', 'Rooms 1–3', 'Sofa bed included'].map(t => (
                    <span key={t} className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── About / host ─────────────────────────────────────────────────── */}
      <section id="about" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-serif font-bold text-white"
          style={{ background: '#1f6757' }}
        >
          S
        </div>
        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-4">Meet Siam</h2>
        <p className="text-gray-600 leading-relaxed mb-6">
          London-based Superhost with 2 years of hosting and 947 reviews across all listings. Rated 4.84 ★ overall.
          100% response rate, responds within a few hours. Every property has been designed with comfort and convenience in mind — Magniflex mattresses, private ensuites, and keypad self-check-in.
        </p>
        <div className="flex justify-center flex-wrap gap-6 text-sm text-gray-500">
          <div className="text-center">
            <div className="font-bold text-2xl text-gray-900">947</div>
            <div>Reviews</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-2xl text-gray-900">4.84★</div>
            <div>Average rating</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-2xl text-gray-900">100%</div>
            <div>Response rate</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-2xl text-gray-900">2 yrs</div>
            <div>Hosting</div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20 text-center" style={{ background: '#1a2c28' }}>
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-serif text-4xl font-bold text-white mb-4">Ready to book?</h2>
          <p className="text-white/70 mb-8">Choose your property and submit your enquiry. Your payment is held securely — nothing charged until confirmed.</p>
          <a
            href="#properties"
            className="inline-block px-10 py-4 rounded-full text-white font-semibold transition-opacity hover:opacity-90"
            style={{ background: '#1f6757' }}
          >
            See all properties
          </a>
        </div>
      </section>
    </div>
  )
}
