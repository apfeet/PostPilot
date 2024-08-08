/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
     backgroundColor: {
      'costom-grey': '#2B4446',
      'costom-cyan': '#90F3FF',
      'costom-lightgrey':'#56696b',
      'costom-darkgrey':'#ECECEC'
     }
    },
  },
  plugins: [],
}

