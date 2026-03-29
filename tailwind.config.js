/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        // Você pode dar o nome que quiser, 'primary' é o padrão para sistemas
        primary: {
          light: '#93C5FD', // Um azul bem clarinho
          DEFAULT: '#0ea5e9', // O seu azul claro principal (Sky 500)
          dark: '#0284c7',  // Azul para hover/foco
        },
      },
    },
  },
  plugins: [],
};
