module.exports = {
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
