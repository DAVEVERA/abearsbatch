import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FBF8F1',
        cream: '#F4EEE1',
        ink: '#3B2617',
        bark: '#5B3A24',
        mid: '#8B5E3C',
        muted: '#6B4E3A',
        copper: { DEFAULT: '#A35F2A', light: '#C97B3D' },
        forest: '#3D4A34',
        night: '#2A1A0F',
        shot: '#E9E5DF',
      },
      fontFamily: {
        display: ['"Fraunces Variable"', 'Georgia', 'serif'],
        sans: ['"Work Sans Variable"', 'system-ui', 'sans-serif'],
      },
      maxWidth: { site: '1280px' },
    },
  },
  plugins: [],
};

export default config;
