/** @type {import('tailwindcss').Config} */
module.exports = {
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
     },
    },
  },
  plugins: [
    function ({ addUtilities }){
      const newUtilities = {
        ".no-scrollbar::webkit-scrollbar": {
          display: "none",
        },
        "no-scrollbar":{
          "-ms-overflow-style":"none",
          "scrollbar-width":"none",
        }
      };
      addUtilities(newUtilities);
    }
  ],
}