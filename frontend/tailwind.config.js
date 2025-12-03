/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        planty: {
          primary: "#14532d",
          secondary: "#22c55e",
          background: "#f6f9f5",
        },
      },
    },
  },
  plugins: [],
};
