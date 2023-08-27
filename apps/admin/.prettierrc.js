module.exports = {
  arrowParens: 'always',
  singleQuote: true,
  jsxSingleQuote: true,
  tabWidth: 2,
  tailwindFunctions: ['classNames'],
  plugins: ['prettier-plugin-tailwindcss'],
  overrides: [
    {
      files: '*.mdx',
      options: {
        tabWidth: 2,
      },
    },
  ],
};