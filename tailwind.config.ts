import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-page': '#faf7f2',
        'bg-alt': '#f0ebe0',
        'bg-card': '#f5f1e9',
        'fg': '#0f0d0c',
        'fg-muted': 'rgba(15,13,12,0.78)',
        'fg-faint': 'rgba(15,13,12,0.55)',
        'border': 'rgba(15,13,12,0.16)',
        'border-strong': 'rgba(15,13,12,0.32)',
        'orange': '#eb4511',
        'orange-muted': 'rgba(180,45,5,0.88)',
        'orange-faint': 'rgba(180,45,5,0.65)',
        'orange-tint': 'rgba(180,45,5,0.18)',
      },
      borderRadius: {
        DEFAULT: '2px',
        sharp: '2px',
        pill: '50px',
      },
      spacing: {
        'gutter-sm': '6px',
        'gutter-md': '10px',
        'gutter-lg': '16px',
        'section-sm': '16px',
        'section-md': '20px',
      },
      maxWidth: {
        'container': '1400px',
      },
      fontFamily: {
        'serif-display': ["'Source Serif 4'", 'Georgia', 'serif'],
        'sans': ["'Inter'", 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'h1': ['clamp(28px, 3.8vw, 48px)', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '600' }],
        'h2': ['clamp(22px, 2.8vw, 36px)', { lineHeight: '1.2', letterSpacing: '-0.015em', fontWeight: '600' }],
        'h3': ['clamp(16px, 1.8vw, 24px)', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '500' }],
        'h4': ['clamp(16px, 1.8vw, 24px)', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '500' }],
        'body': ['clamp(13px, 1.1vw, 15px)', { lineHeight: '1.75', fontWeight: '400' }],
        'label': ['10px', { lineHeight: '1', letterSpacing: '0.3em', fontWeight: '500' }],
      },
      animation: {
        'fadeIn': 'fadeIn 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'fadeIn': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
