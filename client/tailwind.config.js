/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}", 
    "./src/**/*.css",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      newsRed: "#D71D1F",
      newsGray: "#CFD0D6",
      newsBlue: "#2E368F",
      newsGrayBlue: "#717F94",
      newsBlack: "#000000",
      cardBlue: "#4561BF",
      usRed: "#AB2824"
    },
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ],
};
