/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f0ff',
          100: '#cce0ff',
          200: '#99c2ff',
          300: '#66a3ff',
          400: '#3385ff',
          500: '#0077FF', // Primary
          600: '#005ecc',
          700: '#004499',
          800: '#002b66',
          900: '#001133',
        },
        secondary: {
          50: '#e6faf7',
          100: '#ccf5ef',
          200: '#99ebdf',
          300: '#66e0cf',
          400: '#33d6bf',
          500: '#00C2A8', // Secondary
          600: '#009b86',
          700: '#007465',
          800: '#004d43',
          900: '#002722',
        },
        accent: {
          50: '#eeebff',
          100: '#dcd7ff',
          200: '#b9afff',
          300: '#9788ff',
          400: '#7d66ff',
          500: '#6E44FF', // Accent
          600: '#5436cc',
          700: '#3f2999',
          800: '#2a1c66',
          900: '#150e33',
        },
        success: {
          500: '#34C759', // Success
        },
        warning: {
          500: '#FF9500', // Warning
        },
        error: {
          500: '#FF3B30', // Error
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};