module.exports = {
  mode: "jit",
  purge: ["./src/**/*.{js,jsx}", "./dist/*.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    colors: {
      transparent: "transparent",
      pink: {
        DEFAULT: "#9228E8",
      },
      purple: {
        DEFAULT: "#10062D",
      },
      blue: {
        DEFAULT: "2F80ED",
      },
      white: {
        DEFAULT: "#FAF9F6",
        light: "#c0ccda",
      },
      black: {
        DEFAULT: "#000",
      },
      gray: {
        darkest: "#1f2d3d",
        dark: "#3c4858",
        DEFAULT: "#c0ccda",
        light: "#e0e6ed",
        lightest: "#f9fafc",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
