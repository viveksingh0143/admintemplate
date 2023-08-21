const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Inter', ...fontFamily.sans],
        sans: ['Inter var', ...fontFamily.sans],
      },
      spacing: {
        '128': '32rem',
        '256': '65rem',
      },
    },
    colors: {
      primary: 'rgb(var(--color-primary) / <alpha-value>)',
      secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
      success: 'rgb(var(--color-success) / <alpha-value>)',
      warning: 'rgb(var(--color-warning) / <alpha-value>)',
      info: 'rgb(var(--color-info) / <alpha-value>)',
      danger: 'rgb(var(--color-danger) / <alpha-value>)',
      divider: 'rgb(var(--color-divider) / <alpha-value>)',
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography")
  ],
};