import type { Config } from 'tailwindcss';

const config: Config = {
  important: true,
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
    },
    boxShadow: {
      'custom-sm': '0 0 2.5px rgba(0, 0, 0, 0.2)',
    },
  },
  plugins: [],
};
export default config;
