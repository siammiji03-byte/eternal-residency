'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#1f6757' }}>
            <span className="text-white font-serif font-bold text-base">ER</span>
          </div>
          <span className="font-serif font-semibold text-lg" style={{ color: '#1f6757' }}>
            Eternal Residency
          </span>
        </Link>

        {/* Nav — desktop */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link href="/#properties" className="text-gray-600 hover:text-teal-700 transition-colors">
            Properties
          </Link>
          <Link href="/#locations" className="text-gray-600 hover:text-teal-700 transition-colors">
            Locations
          </Link>
          <Link href="/#about" className="text-gray-600 hover:text-teal-700 transition-colors">
            About
          </Link>
          <Link
            href="/#properties"
            className="px-4 py-2 rounded-full text-white text-sm font-medium transition-colors"
            style={{ background: '#1f6757' }}
          >
            Book Direct
          </Link>
        </nav>

        {/* Hamburger — mobile */}
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4 text-sm">
          <Link href="/#properties" onClick={() => setMenuOpen(false)} className="text-gray-700">Properties</Link>
          <Link href="/#locations" onClick={() => setMenuOpen(false)} className="text-gray-700">Locations</Link>
          <Link href="/#about" onClick={() => setMenuOpen(false)} className="text-gray-700">About</Link>
          <Link
            href="/#properties"
            onClick={() => setMenuOpen(false)}
            className="text-center py-2 rounded-full text-white font-medium"
            style={{ background: '#1f6757' }}
          >
            Book Direct
          </Link>
        </div>
      )}
    </header>
  )
}
