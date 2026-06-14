import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Eternal Residency | Direct Booking – Rome, Italy',
  description:
    'Book directly with Eternal Residency for the best rates on apartments and private rooms in Rome. No booking fees. Near Termini Station and San Giovanni.',
  openGraph: {
    title: 'Eternal Residency | Direct Booking – Rome',
    description: 'Luxury apartments and private rooms in the heart of Rome. Book direct and save.',
    images: [
      'https://a0.muscache.com/im/pictures/miso/Hosting-1106493070534334005/original/d00f05c1-87fc-402b-8513-d657d28802a8.jpeg?im_w=1200',
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
