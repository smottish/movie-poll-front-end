const colors = require("tailwindcss/colors");
module.exports = {
  purge: ["./src/**/*.{js,jsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      gridTemplateColumns: {
        layout: "25% 1fr",
      },
      gridTemplateRows: {
        layout: "auto 1fr",
      },
    },
    colors: {
      blue: colors.sky,
      yellow: colors.amber,
      orange: colors.orange,
      red: colors.red,
      pink: colors.pink,
      white: colors.white,
      gray: colors.gray,
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
