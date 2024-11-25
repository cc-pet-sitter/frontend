/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
        boxShadow: {
          custom: `0 0 6px rgba(0, 0, 0, 0.2)`,
      },
  },
    container: {
      center: true,
    },
  },

  plugins: [],
};
