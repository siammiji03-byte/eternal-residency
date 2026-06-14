import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50:  '#eef6f3',
          100: '#d5ebe4',
          200: '#aed8ca',
          300: '#7dbfad',
          400: '#4fa18e',
          500: '#2d8470',
          600: '#1f6757',
          700: '#1a5548',
          800: '#174439',
          900: '#12332b',
        },
        gold: {
          400: '#d4a843',
          500: '#c9a03a',
        },
        cream: '#fafaf7',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config
