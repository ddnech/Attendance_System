/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "../../node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    fontFamily: {
      lora: ["Lora", "serif"],
      maitree: ["Maitree", "serif"],
      josefin: ["Josefin Sans", "sans-serif"],
      ysa: ["Ysabeau Infant", "sans-serif"],
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    colors: {
      darkgreen: "#013820",
      lightgreen: "#ABE090",
      jetblack: "#302C2C",
      babypowder: "#FDFFF7",
      flashwhite: "#D3D3D3",
      redd: "#C91A3D",
      bluee: "#1A3DC9",
      greenn: "#3DC91A",
      navy: '#FF7F50',
      steel_b: "#4682B4",
      corn: "#6495ED",
      saphire: "#0F52BA",
      t: "#E3F4F4"
    },
    fontSize: {
      xxs: "0.5rem",
      xs: "0.75rem",
      sm: "0.8rem",
      base: "1rem",
      xl: "1.25rem",
      "2xl": "1.563rem",
      "3xl": "1.953rem",
      "4xl": "2.441rem",
      "5xl": "3.052rem",
    },
    letterSpacing: {
      tighter: "-0.1em",
      tight: "-0.05em",
      normal: "0",
      wide: "0.1em",
      wider: "0.2em",
      widest: "0.3em",
    },
  },
  plugins: [require("flowbite/plugin")],
};
