/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["/index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        progress: {
          '0%': { width: '100%' },
          '100%': { width: '0%' },
        },
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
      },
      animation: {
        progress: 'progress 5s linear forwards',
        fadeOut: 'fadeOut 1s ease-in-out forwards',
        marquee: 'marquee 20s linear infinite',
      },
    },
    screens: {
      sm: '780px',
    },
  },
  plugins: [],
}

