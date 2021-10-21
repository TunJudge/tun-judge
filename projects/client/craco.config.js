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
};
