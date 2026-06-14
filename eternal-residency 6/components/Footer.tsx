export default function Footer() {
  return (
    <footer className="text-white py-12 mt-20" style={{ background: '#17503f' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-white/20">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-white font-serif font-bold text-base">ER</span>
              </div>
              <span className="font-serif font-semibold text-lg">Eternal Residency</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Luxury apartments and private rooms in the heart of Rome. Book direct for the best rates — no platform fees.
            </p>
          </div>

          {/* Properties */}
          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-wide uppercase text-white/60">Properties</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>Eternal Residency (4-bed, Termini)</li>
              <li>Rooms 1–4 (Termini)</li>
              <li>Roman Escape (2-bed, San Giovanni)</li>
              <li>Roman Escape Rooms 1–3</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-wide uppercase text-white/60">Contact</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>Rome, Lazio, Italy</li>
              <li>
                <a href="mailto:siammiji03@gmail.com" className="hover:text-white transition-colors">
                  siammiji03@gmail.com
                </a>
              </li>
              <li className="text-white/50 text-xs mt-4">Host: Siam · Superhost · 947 reviews · 4.84 ★</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-white/50 text-xs">
          <p>© {new Date().getFullYear()} Eternal Residency. All rights reserved.</p>
          <p>Payments secured by Stripe. Your card is held until booking is confirmed.</p>
        </div>
      </div>
    </footer>
  )
}
