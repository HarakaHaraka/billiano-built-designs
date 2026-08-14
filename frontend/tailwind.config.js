/**
 * Billiano Built Designs — design tokens.
 * Palette: sage / pine / terracotta on a clean near-white (sage-tint) background.
 * Display font: Caprasimo (loaded via Google Fonts in index.html); body: Inter.
 * KEEP these tokens and the wordmark. The old brown/organic paper background is dropped.
 */
module.exports = {
  content: ['./public/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        // Deep pine green — primary brand colour (headings, header, footer)
        pine: {
          DEFAULT: '#24463A',
          50: '#EEF3F0',
          100: '#D6E2DB',
          200: '#AEC5B7',
          300: '#7FA48D',
          400: '#4F7A63',
          500: '#356452',
          600: '#24463A',
          700: '#1D392F',
          800: '#152A23',
          900: '#0E1C17'
        },
        // Muted sage — secondary / supporting
        sage: {
          DEFAULT: '#7E9B7E',
          50: '#F1F5F1',
          100: '#E1EAE1',
          200: '#C6D5C6',
          300: '#A8BEA8',
          400: '#8FAA8F',
          500: '#7E9B7E',
          600: '#617D61',
          700: '#4C634C',
          800: '#3A4B3A',
          900: '#293429'
        },
        // Warm terracotta — accent / primary call-to-action
        terracotta: {
          DEFAULT: '#BC6B4C',
          50: '#F8EDE7',
          100: '#F0D8CB',
          200: '#E2B49E',
          300: '#D28F6F',
          400: '#C67A56',
          500: '#BC6B4C',
          600: '#9E5539',
          700: '#7C422C',
          800: '#5A301F',
          900: '#3B2015'
        },
        // Near-white background (sage-tint) + ink text
        paper: '#F5F7F2',
        surface: '#FFFFFF',
        ink: '#1C241F',
        muted: '#5B6B60'
      },
      fontFamily: {
        display: ['Caprasimo', 'Georgia', 'ui-serif', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif']
      },
      maxWidth: {
        content: '72rem'
      },
      boxShadow: {
        card: '0 1px 2px rgba(28,36,31,0.04), 0 8px 24px -12px rgba(28,36,31,0.18)',
        panel: '0 24px 60px -20px rgba(28,36,31,0.35)'
      },
      borderRadius: {
        xl2: '1.25rem'
      }
    }
  },
  plugins: []
};
