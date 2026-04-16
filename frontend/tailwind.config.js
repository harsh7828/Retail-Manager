/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef8ff",
          100: "#d9efff",
          600: "#1b86f8",
          700: "#126ed1",
        },
      },
    },
  },
  plugins: [],
};
