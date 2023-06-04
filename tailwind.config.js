import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    colors: {
      primary: colors.purple,
      secondary: colors.lime,
      bg: colors.gray[200]
    },
    extend: {},
  },
  plugins: [],
}

