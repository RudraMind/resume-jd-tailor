export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Outfit', 'system-ui', 'sans-serif'],
        body: ['Outfit', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          purple: '#6C3FC5',
          blue: '#3B82F6',
        },
        score: {
          red: '#EF4444',
          amber: '#F59E0B',
          green: '#22C55E',
        },
      },
    },
  },
  plugins: [],
};
