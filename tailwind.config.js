/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily:{
        sans:  "SF Pro Display"
      },
      colors:{
        background: "#3f3f3f"
      }
    },
  },
  plugins: [
   
  ],
} 
