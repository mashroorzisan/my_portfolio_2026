/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:        '#F7F5F0',
        'bg-alt':  '#EEEAE2',
        card:      '#FFFFFF',
        navy:      '#0D1B2A',
        'navy-mid':'#1E3A5F',
        blue:      '#1D4ED8',
        'blue-l':  '#3B82F6',
        coral:     '#E85D2F',
        gold:      '#D97706',
        border:    '#DDD8CE',
        mid:       '#4A5568',
        light:     '#8896A4',
      },
      fontFamily: {
        serif: ['"Fraunces"', 'serif'],
        mono:  ['"JetBrains Mono"', 'monospace'],
        sans:  ['"DM Sans"', 'sans-serif'],
      },
      animation: {
        'fade-up':  'fadeUp 0.6s ease forwards',
        'pulse-dot':'pulse 2s infinite',
        'blink':    'blink 1s infinite',
      },
      keyframes: {
        fadeUp: { from:{ opacity:'0', transform:'translateY(24px)' }, to:{ opacity:'1', transform:'translateY(0)' } },
        blink:  { '0%,100%':{ opacity:'1' }, '50%':{ opacity:'0' } },
      },
    },
  },
  plugins: [],
}
