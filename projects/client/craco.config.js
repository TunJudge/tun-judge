const path = require('path');

module.exports = {
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
  devServer: {
    proxy: [
      {
        context: ['/api/**'],
        target: `http://localhost:3001/`,
      },
      {
        context: ['/socket.io'],
        target: `ws://localhost:3001/`,
        ws: true,
      },
    ],
  },
  webpack: {
    alias: {
      '@core': path.resolve(__dirname, './src/core'),
      '@shared': path.resolve(__dirname, './src/shared'),
    },
  },
};
