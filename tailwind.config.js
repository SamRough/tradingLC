/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        rams: {
          bg:      '#F5F0E8',
          surface: '#EDE7D9',
          muted:   '#E5DDCE',
          card:    '#FAF7F2',
          hover:   '#F0EBE0',
        },
        ink: {
          DEFAULT: '#2D2D2D',
          soft:    '#5C5C5C',
          muted:   '#8A8A8A',
        },
        flame: {
          DEFAULT: '#E8651A',
          light:   '#F0772F',
          dark:    '#D45510',
        },
        flow: {
          stock:  '#8B5CF6',
          money:  '#10B981',
          order:  '#F59E0B',
          settle: '#6366F1',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system', 'BlinkMacSystemFont',
          '"Helvetica Neue"', 'Helvetica', 'Arial',
          'sans-serif',
        ],
        mono: [
          '"JetBrains Mono"', '"SF Mono"', '"Fira Code"',
          'Menlo', 'monospace',
        ],
      },
      borderRadius: {
        'rams': '0.5rem',
      },
      boxShadow: {
        'rams': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'rams-lg': '0 4px 16px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04)',
        'flame': '0 0 0 3px rgba(232, 101, 26, 0.2)',
      },
    },
  },
  plugins: [],
};
