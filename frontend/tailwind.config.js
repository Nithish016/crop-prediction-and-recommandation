/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        agro: {
          50: '#f2f9f1',
          100: '#e1f2df',
          200: '#c5e6c0',
          300: '#9cd293',
          400: '#6db462',
          500: '#4c9641',
          600: '#3a7b30',
          700: '#306228',
          800: '#294f23',
          900: '#23421f',
          950: '#0f240d',
        },
      },
    },
  },
  plugins: [],
}
