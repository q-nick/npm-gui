import Ws from 'ws';

const WebSocketServer = Ws.Server;

let consoleSocket = null;

export default {
  send(msg, id) {
    if (consoleSocket) {
      // TODO we will send command ID to group commands in separated console windows
      consoleSocket.send(JSON.stringify({
        msg,
        id,
      }));
    }
  },

  bind(server) {
    const wss = new WebSocketServer({
      server,
    });

    wss.on('connection', (ws) => {
      consoleSocket = ws;
      this.send('console connected \n', 'default');
    });

    wss.on('message', () => {
      // console.log(a, b, c);
    });
  },
};
