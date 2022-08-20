module.exports = {
  mode: "jit",
  content: ["./*.html", "./src/**/*.{js,jsx,ts,tsx,vue}"],
  plugins: [],
  // Specify other options here
  theme: {
    extends: {
      colors: {
        findHotel: "#0171F3",
      },
    },
  },
}
