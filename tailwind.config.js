/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{html,js,svelte}", "./public/**/*.{html,js,svelte}", "node_modules/preline/dist/*.js"],
  darkMode: "selector",
  theme: {
    extend: {
      colors: {
        // you can either spread `colors` to apply all the colors
        ...colors,
      },
    },
  },
  plugins: [require("preline/plugin")],
};
