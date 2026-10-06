/**
 * Design tokens for "The Artisan Kiln".
 *
 * Every custom colour, font and effect used by the UI lives here. The palette
 * was sampled from the mockups in `design/` (see README → "Design tokens").
 * Tailwind v4 picks this file up through the `@config` directive in
 * `src/app/globals.css`.
 *
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      screens: {
        // Wider than the mockup (1376px): the page floats as a window on a backdrop.
        wide: '90rem',
      },
      colors: {
        // Paper background of the page.
        cream: {
          DEFAULT: '#f8f4e4',
          light: '#fcf9ee',
          dark: '#f1ead4',
        },
        // Panels, table headers, the visualizer canvas.
        sand: {
          DEFAULT: '#e8dcc0',
          light: '#efe5cd',
          dark: '#ddcda9',
        },
        // Hand-inked outlines and text.
        ink: {
          DEFAULT: '#17140f',
          soft: '#3a352d',
          muted: '#6d655a',
          faint: '#a39a8a',
        },
        // Primary actions: "Place secure order", user pill, scrollbars.
        navy: {
          DEFAULT: '#445478',
          dark: '#37425f',
          light: '#5f6f96',
        },
        sage: {
          DEFAULT: '#4b7563',
          dark: '#3c5f50',
          light: '#6c9584',
        },
        terracotta: {
          DEFAULT: '#b06844',
          dark: '#8f4f2f',
          light: '#cd8d6a',
        },
        mustard: {
          DEFAULT: '#c99a48',
          dark: '#a67b2f',
          light: '#e0bb6c',
        },
        // Payment network marks keep their recognisable colours.
        brand: {
          'mc-red': '#e0322b',
          'mc-orange': '#f29a2e',
          'mc-overlap': '#f0662a',
          'paypal-navy': '#253b80',
          'paypal-blue': '#2a8fd6',
        },
      },
      fontFamily: {
        // Barlow Condensed is loaded with next/font in src/app/layout.tsx.
        sans: ['var(--font-barlow-condensed)', 'Arial Narrow', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-barlow-condensed)', 'Arial Narrow', 'ui-sans-serif', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
      },
      borderWidth: {
        1.5: '1.5px',
        3: '3px',
      },
      borderRadius: {
        tile: '5px',
        frame: '18px',
      },
      boxShadow: {
        // Flat "printed sticker" offset used by buttons and lifted tiles.
        ink: '2px 2px 0 0 #17140f',
        'ink-sm': '1px 1px 0 0 #17140f',
        tile: '0 1px 0 0 rgb(23 20 15 / 0.35)',
        lift: '0 14px 28px -8px rgb(23 20 15 / 0.45), 0 4px 10px -4px rgb(23 20 15 / 0.3)',
        frame: '0 30px 60px -30px rgb(55 66 95 / 0.45)',
      },
      maxWidth: {
        frame: '1376px',
      },
      keyframes: {
        'shake-x': {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-4px)' },
          '40%, 80%': { transform: 'translateX(4px)' },
        },
      },
      animation: {
        'shake-x': 'shake-x 0.4s ease-in-out',
      },
    },
  },
  plugins: [],
};
