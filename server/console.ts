import Ws from 'ws';
import type { Server } from 'http';

let consoleSocket: Ws | undefined;

export function send(msg: string, id: string, status = 'LIVE'): void {
  if (consoleSocket) {
    // TODO we will send command ID to group commands in separated console windows
    consoleSocket.send(JSON.stringify({
      msg,
      id,
      status,
    }));
  }
}

export function bind(server: Readonly<Server>): void {
  const wss = new Ws.Server({
    server,
  });

  wss.on('connection', (ws) => {
    consoleSocket = ws;
    send('console connected \n', 'default');
  });

  wss.on('message', () => {
    // console.log(a, b, c);
  });
}
