const flowbite = require("flowbite-react/tailwind");
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      screens: {
        'phone': '400px',
    
        'tablet': '640px',
    
        'laptop': '1024px',
      },
    },
  },
  plugins: [ flowbite.plugin(),],
}

