/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#EF4444",
        secondary: "#F59E0B",
      },
    },
  },
  plugins: [],
};
