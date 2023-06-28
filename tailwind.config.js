/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: [
    "./node_modules/flowbite-react/**/*.js",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    // "!./node_modules",
  ],
  theme: {
    extend: {},
    screens: {
      phone: { min: "280px", max: "767px" },
      // => @media (min-width: 640px and max-width: 767px) { ... }
      ...defaultTheme.screens,
    },
  },
  plugins: [require("flowbite/plugin")],
};
