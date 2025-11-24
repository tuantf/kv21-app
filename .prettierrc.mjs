/** @type {import("prettier").Config} */
const prettierConfig = {
  printWidth: 100,
  useTabs: false,
  tabWidth: 2,
  singleQuote: true,
  trailingComma: 'all',
  arrowParens: 'avoid',
  semi: false,
  plugins: ['prettier-plugin-tailwindcss'],
}

export default prettierConfig
