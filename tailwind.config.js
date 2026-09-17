/** @type {import('tailwindcss').Config} */
export default {
  content: ["./*.html", "./site.js"],
  theme: {
    extend: {
      colors: {
        primary: "#f00f75",
        accent: "#7b2cbf",
        background: "#0a0a0a",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "sans-serif"],
      },
    },
  },
};