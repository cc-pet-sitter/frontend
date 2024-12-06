/** @type {import('tailwindcss').Config} */

// const withMT = require("@material-tailwind/react/utils/withMT");
import withMT from "@material-tailwind/react/utils/withMT";

export default module.exports = withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
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
      width: {
        full: "100%", // Ensure full width is 100% viewport width
      },
      maxWidth: {
        none: "none", // Remove any default max width
      },
    },
  },

  plugins: [require("flowbite/plugin"), require("@tailwindcss/forms")],
});
