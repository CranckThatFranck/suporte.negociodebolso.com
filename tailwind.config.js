/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        border: 'var(--color-border)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error-cancel)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        h1: ['30px', { lineHeight: '1.2', fontWeight: '600' }],
        h2: ['24px', { lineHeight: '1.2', fontWeight: '600' }],
        h3: ['20px', { lineHeight: '1.3', fontWeight: '600' }],
        body: ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        caption: ['12px', { lineHeight: '1.5', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
}
