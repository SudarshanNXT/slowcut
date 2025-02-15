/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#14171C',
        secondary: '#2C343F',
        light: '#556678',
        hover: '#00B021',
        accent: '#F27405'
      },
      animation: {
        wave: "wave 0.6s infinite ease-in-out",
      },
      keyframes: {
        wave: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
    container: {
      center: true, 
      screens: {
        sm: '600px',
        md: '720px',
        lg: '900px', 
        xl: '1080px',
      },
    },
  },
  plugins: [],
}

// screens: {
//   'sm': '640px',
//   'md': '768px',
//   'lg': '1024px',
//   'xl': '1280px',
//   '2xl': '1536px',
// }