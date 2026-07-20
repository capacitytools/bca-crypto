/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'bca-bg': '#050505',
        'bca-card': 'rgba(255, 255, 255, 0.03)',
        'bca-border': 'rgba(255, 255, 255, 0.08)',
      }
    }
  },
  plugins: [],
};
