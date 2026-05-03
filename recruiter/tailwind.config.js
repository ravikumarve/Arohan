/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../shared/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        recruiter: {
          primary: '#8B5CF6',      // Violet-500
          'primary-light': '#A78BFA', // Violet-400
          'primary-dark': '#7C3AED',  // Violet-600
          secondary: '#EC4899',     // Pink-500
          'secondary-light': '#F472B6', // Pink-400
          success: '#10B981',        // Emerald-500
          warning: '#F59E0B',        // Amber-500
          danger: '#EF4444',         // Red-500
          info: '#3B82F6',           // Blue-500
          'background-primary': '#0F0F23',    // Deep violet-black
          'background-secondary': '#1A1A2E',  // Lighter violet-black
          'background-tertiary': '#252542',   // Lightest violet-black
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
