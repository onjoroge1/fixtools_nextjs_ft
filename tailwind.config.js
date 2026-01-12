/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 12px 40px rgba(2, 6, 23, 0.08)',
      },
    },
  },
  plugins: [],
};


