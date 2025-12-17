/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enables manual dark mode toggling
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      colors: {
        // Light Mode Palette (Warm/Claude-ish)
        light: {
          bg: '#FAF9F6',       // Off-white/Bone
          sidebar: '#F3F0E9',  // Beige sidebar
          border: '#E5E0D8',
          text: '#2D2D2D',
          user: '#EBE5D9',     // User bubble
        },
        // Dark Mode Palette (Deep Slate)
        dark: {
          bg: '#1A1A1A',       // Soft Black
          sidebar: '#121212',  // Darker sidebar
          border: '#2A2A2A',
          text: '#E0E0E0',
          user: '#2A2A2A',     // User bubble
        }
      }
    },
  },
  plugins: [],
}