import * as Ws from 'ws';
import { Server } from 'http';

let consoleSocket: Ws = null;

export function send(msg: string, id: string, status = 'LIVE'):void {
  if (consoleSocket) {
    // TODO we will send command ID to group commands in separated console windows
    consoleSocket.send(JSON.stringify({
      msg,
      id,
      status,
    }));
  }
}

export function bind(server: Server):void {
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
