/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        charcoal: "var(--color-charcoal)",
        grey: "var(--color-grey)",
        lightGrey: "var(--color-light-grey)",
        white: "var(--color-white)",
      },
    },
  },
  plugins: [],
};
