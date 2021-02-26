import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
// import morgan from 'morgan';
// import opn from 'opn';
import type http from 'http';
import * as Console from './console';

import { projectRouter } from './routers/project.router';
import { searchRouter } from './routers/search.router';
import { explorerRouter } from './routers/explorer.router';
import { infoRouter } from './routers/info.router';
import { logRouter } from './routers/log.router';
import { globalDependenciesRouter } from './routers/globalDependencies.router';

// Define a port/host we want to listen to
const PORT = 1337;
const HOST = 'localhost';

export const app = express();

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
if (process.env.NODE_TEST !== undefined) {
  // app.use(morgan('combined'));
}
// routes
// app

app.use('/api/explorer', explorerRouter);
app.use('/api/search', searchRouter);
app.use('/api/project', projectRouter);
app.use('/api/global', globalDependenciesRouter);
app.use('/api/info', infoRouter);

app.use('/', express.static(path.normalize(`${__dirname}/../client`), { index: ['index.html'] }));

app.use('/api/log', logRouter);

app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, '/../client', 'index.html'));
});

// error handler
app.use((err: unknown, _: unknown, res: express.Response, next: express.NextFunction) => {
  // No routes handled the request and no system error, that means 404 issue.
  // Forward to next middleware to handle it.
  if (!err) {
    next();
    return;
  }

  res.status(400).send({ error: err });
});

export function start(host = 'localhost', port = 3000): http.Server {
  // start server
  const server = app.listen(port || PORT, host || HOST, () => {
    console.log(`npm-gui web-server running at http://${(host || HOST)}:${(port || PORT)}/`);
    // opn(`http://${(host || HOST)}:${(port || PORT)}`);
  });

  Console.bind(server);

  return server;
}
