/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        'material-primary': '#1976D2',
        'material-secondary': '#FF8F00',
        'material-surface': '#FFFFFF',
        'material-error': '#D32F2F',
        'material-success': '#388E3C',
        'gradient-start': '#F4B942',
        'gradient-end': '#E85D75',
      },
      boxShadow: {
        'material-1': '0 2px 4px rgba(0,0,0,0.14), 0 3px 4px rgba(0,0,0,0.12)',
        'material-2': '0 4px 8px rgba(0,0,0,0.14), 0 6px 8px rgba(0,0,0,0.12)',
        'material-3': '0 8px 16px rgba(0,0,0,0.14), 0 12px 16px rgba(0,0,0,0.12)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'ripple': 'ripple 0.6s linear',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};