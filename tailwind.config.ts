const config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Stack Sans Text', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif']
      },
      colors: {
        primary: '#0f172a',
        accent: '#38bdf8'
      },
      backgroundImage: {
        gradient: 'radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.35), transparent 60%), radial-gradient(circle at 80% 0%, rgba(15, 23, 42, 0.4), transparent 55%)'
      }
    }
  },
  plugins: []
}

export default config

