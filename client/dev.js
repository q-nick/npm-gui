/* eslint-disable */
const ParcelProxyServer = require('parcel-proxy-server');
const Path = require('path');

const entryFiles = Path.join(__dirname, 'index.html');

// configure the proxy server
const server = new ParcelProxyServer({
  entryPoint: entryFiles,
  parcelOptions: {
    open: true,
  },
  proxies: {
    // add proxies here
    '/api/': {
      target: 'http://localhost:3000',
    },
  },
});

// start up the server
server.listen(1234, () => {
  console.log('port 1234');
});
