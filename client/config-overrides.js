// eslint-disable-next-line @typescript-eslint/no-var-requires
const { override, addPostcssPlugins } = require('customize-cra');

module.exports = {
  webpack: override(addPostcssPlugins([require('tailwindcss'), require('autoprefixer')])),
  devServer: (configFnc) => (proxy, allowedHost) =>
    configFnc(
      [
        {
          context: ['/api/**'],
          target: `http://localhost:3000/`,
        },
        {
          context: ['/socket.io'],
          target: `ws://localhost:3000/`,
          ws: true,
        },
      ],
      allowedHost,
    ),
};
