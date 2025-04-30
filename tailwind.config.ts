import type { Config } from "tailwindcss"

const config = {
  darkMode: "media",
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Tus colores personalizados aquí
      },
    },
  },
  plugins: [],
} satisfies Config

export default config 