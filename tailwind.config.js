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
      mobile: '370px',
      desktop: '692px',
    },
    colors: {
      white: '#FFFFFF',
      black: '#35495e',
      blue: '#8ecfe0',
      'blue-dark': '#00acc1',
      'gray-light': '#efefef',
      'gray-dark': '#607d8b'
    },
    extend: {},
  },
  plugins: [],
};
