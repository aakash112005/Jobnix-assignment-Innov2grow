/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0F1222',
        paper: '#F6F7FB',
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#121628',
        },
        primary: {
          50: '#EEF7F4',
          100: '#D3EBE3',
          200: '#A8D7C7',
          300: '#78C0A7',
          400: '#419C7E',
          500: '#1F6F5C',
          600: '#195A4A',
          700: '#14483C',
          800: '#0F362D',
          900: '#0A241E',
        },
        accent: {
          50: '#FEF6E8',
          100: '#FCE7C2',
          200: '#F9D28F',
          300: '#F5BC5C',
          400: '#F2A93B',
          500: '#E8921A',
          600: '#C57414',
          700: '#9C5A10',
        },
        violet: {
          400: '#8A7CF0',
          500: '#6C5CE7',
          600: '#5647C4',
        },
      },
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        soft: '0 2px 8px rgba(15, 18, 34, 0.06), 0 1px 2px rgba(15, 18, 34, 0.04)',
        card: '0 8px 24px rgba(15, 18, 34, 0.08)',
        lift: '0 16px 40px rgba(15, 18, 34, 0.14)',
      },
      backgroundImage: {
        'pipeline-gradient': 'linear-gradient(90deg, #1F6F5C 0%, #6C5CE7 50%, #F2A93B 100%)',
      },
    },
  },
  plugins: [],
};
