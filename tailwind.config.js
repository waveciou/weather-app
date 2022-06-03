/* eslint-disable no-undef */
module.exports = {
  prefix: 'tw-',
  content: [
    './src/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{scss,module.scss}',
  ],
  theme: {
    screens: {
      desktop: '692px',
    },
    colors: {
      white: '#FFFFFF',
      black: '#35495e',
      blue: '#8ecfe0',
      'gray-dark': '#607d8b'
    },
    extend: {},
  },
  plugins: [],
};
