import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
// import opn from 'opn';
import type http from 'http';

import { searchRouter } from './routers/search.router';
import { explorerRouter } from './routers/explorer.router';
import { infoRouter } from './routers/info.router';
import { logRouter } from './routers/log.router';
import { unmatchedHandler } from './middlewares/unmatched';
import { errorHandler } from './middlewares/error';
import { getAllDependencies, getAllDependenciesSimple } from './actions/dependencies/get/getProjectDependencies';
import { catchErrors } from './catchErrors';
import { addDependencies } from './actions/dependencies/add/addProjectDependencies';
import { deleteDependency } from './actions/dependencies/delete/deleteProjectDependencies';
import { installDependencies } from './actions/dependencies/install/installProjectDependencies';
import { getGlobalDependencies, getGlobalDependenciesSimple } from './actions/dependencies/get/getGlobalDependencies';
import { projectPathAndNpmYarnMiddleware } from './middlewares/projectPathAndNpmYarnMiddleware';
import { deleteGlobalDependency } from './actions/dependencies/delete/deleteGlobalDependencies';
import { addGlobalDependencies } from './actions/dependencies/add/addGlobalDependencies';

// Define a port/host we want to listen to
const PORT = 1337;
const HOST = 'localhost';

export const app = express();

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// project routes
app.use('/api/project/:projectPath', projectPathAndNpmYarnMiddleware);
app.get('/api/project/:projectPath/dependencies/simple', getAllDependenciesSimple); // fast list
app.get('/api/project/:projectPath/dependencies/full', catchErrors(getAllDependencies)); // full list
app.post('/api/project/:projectPath/dependencies/install/:force?', catchErrors(installDependencies)); // install/hard install dependencies in project
app.post('/api/project/:projectPath/dependencies/:type', catchErrors(addDependencies)); // add dependencies
app.delete('/api/project/:projectPath/dependencies/:type/:dependencyName', catchErrors(deleteDependency)); // remove dependency

// global routes
app.get('/api/global/dependencies/simple', catchErrors(getGlobalDependenciesSimple)); // fast list global
app.get('/api/global/dependencies/full', catchErrors(getGlobalDependencies)); // full list global
app.post('/api/global/dependencies', catchErrors(addGlobalDependencies)); // add dependencies global
app.delete('/api/global/dependencies/global/:dependencyName', catchErrors(deleteGlobalDependency)); // remove dependency global

// other routes
app.use('/api/explorer', explorerRouter);
app.use('/api/search', searchRouter);
app.use('/api/info', infoRouter);
app.use('/api/log', logRouter);

app.use('/', express.static(path.normalize(`${__dirname}/../client`), { index: ['index.html'] }));
app.get('*', unmatchedHandler);
app.use(errorHandler);

const DEFAULT_PORT = 3000;

export function start(host = 'localhost', port = DEFAULT_PORT): http.Server {
  // start server
  const server = app.listen(port || PORT, host || HOST, () => {
    console.log(`npm-gui web-server running at http://${host || HOST}:${port || PORT}/`);
    // opn(`http://${(host || HOST)}:${(port || PORT)}`);
  });

  return server;
}
