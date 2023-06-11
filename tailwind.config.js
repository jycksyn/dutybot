import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    colors: {
      primary: colors.purple,
      secondary: colors.lime,
      tertiary: colors.red,
      bg: colors.gray[200],
      white: colors.white
    },
    fontFamily: {
      'sans': ["Quicksand", "sans-serif"]
    },
    extend: {
      animation: {
        'particle': 'particle 60s linear infinite',
      },
      keyframes: {
        particle: {
          '0%': { transform: 'translate(0vw)' },
          '100%': { transform: 'translate(-100vw)' },
        }
      }
    },
  },
  plugins: [],
}

