/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        stone: {
          950: '#0c0a08',
          900: '#131110',
          850: '#1c1917',
          800: '#222019',
          700: '#2e2b28',
          600: '#3a3530',
          500: '#57534e',
          400: '#78716c',
          300: '#a8a29e',
          200: '#e2ddd8',
          100: '#f5f1ee',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['SF Mono', 'Fira Code', 'Cascadia Mono', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
