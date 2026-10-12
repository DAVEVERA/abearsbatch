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
        char: '#0E0A07',
        soot: '#17110C',
        ember: '#E2622B',
        amber: '#F0A35C',
        ash: '#A89F94',
        bone: '#EDE6DA',
      },
      fontFamily: {
        display: ['"Fraunces Variable"', 'Georgia', 'serif'],
        sans: ['"Work Sans Variable"', 'system-ui', 'sans-serif'],
      },
      maxWidth: { site: '1280px' },
      transitionTimingFunction: { out: 'cubic-bezier(0.16, 1, 0.3, 1)' },
    },
  },
  plugins: [],
};

export default config;
