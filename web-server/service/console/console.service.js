const WebSocketServer = require('ws').Server;

let consoleSocket = null;

module.exports = {
  send(msg) {
    if (consoleSocket) {
      consoleSocket.send(msg);
    }
  },

  bind(server) {
    const wss = new WebSocketServer({
      server,
    });

    wss.on('connection', (ws) => {
      consoleSocket = ws;
      consoleSocket.send('console connected \n');
    });

    wss.on('message', () => {
      // console.log(a, b, c);
    });
  },
};
