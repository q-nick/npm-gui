import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as morgan from 'morgan';
// import opn from 'opn';
import * as Console from './console';
import * as http from 'http';

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
if (!process.env.NODE_TEST) {
  app.use(morgan('combined'));
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

function start(host: string, port: number): http.Server {
  // start server
  const server = app.listen(port || PORT, host || HOST, () => {
    console.log(`npm-gui web-server running at http://${(host || HOST)}:${(port || PORT)}/`);
    // opn(`http://${(host || HOST)}:${(port || PORT)}`);
  });

  Console.bind(server);

  return server;
}

export default start;
