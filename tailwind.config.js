/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Certifique-se de que isso abrange todos os arquivos do projeto
  ],
  theme: {
    extend: {
      keyframes: {
        dots: {
          "0%, 20%": { content: "'...'" },
          "40%": { content: "'..'" },
          "60%": { content: "'.'" },
          "80%, 100%": { content: "''" },
        },
      },
      animation: {
        "dot-animation": "dots 1s infinite",
      },
    },
  },
  plugins: [],
};
