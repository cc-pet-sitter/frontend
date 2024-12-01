/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        custom: `0 0 6px rgba(0, 0, 0, 0.2)`,
      },
      colors: {
        background: "#FDF4E3",
        brown: "#BC560A",
        seBtnBg: "#D87607",
        seBtnHover: "#f49d0c",
        prBtnBg: "#fabe25",
        prBtnText: "#333333",
        prBtnHover: "#f9b70c",
      },
    },
  },

  plugins: [],
};
