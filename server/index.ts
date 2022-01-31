import open from 'open';

import { availableManagers } from './actions/available-managers/available-managers';
import { addGlobalDependencies } from './actions/dependencies/add/addGlobalDependencies';
import { addDependencies } from './actions/dependencies/add/addProjectDependencies';
import { deleteGlobalDependency } from './actions/dependencies/delete/deleteGlobalDependencies';
import { deleteDependency } from './actions/dependencies/delete/deleteProjectDependencies';
import {
  getGlobalDependencies,
  getGlobalDependenciesSimple,
} from './actions/dependencies/get/getGlobalDependencies';
import {
  getAllDependencies,
  getAllDependenciesSimple,
} from './actions/dependencies/get/getProjectDependencies';
import { installDependencies } from './actions/dependencies/install/installProjectDependencies';
import { explorer } from './actions/explorer/explorer';
import { info } from './actions/info/info';
import { log } from './actions/log/log';
import { search } from './actions/search/search';
import { projectPathAndManagerMiddleware } from './middlewares/projectPathAndManagerMiddleware';
import { Server } from './simple-express';

const DEFAULT_PORT = 3000;
const DEFAULT_HOST = 'localhost';

export const app = new Server();

app.use('/api/project/:projectPath/', projectPathAndManagerMiddleware);

app.get(
  '/api/project/:projectPath/dependencies/simple',
  getAllDependenciesSimple,
);
app.get('/api/project/:projectPath/dependencies/full', getAllDependencies);
app.post(
  '/api/project/:projectPath/dependencies/install/:forceManager',
  installDependencies,
);
app.post('/api/project/:projectPath/dependencies/install', installDependencies);
app.post('/api/project/:projectPath/dependencies/:type', addDependencies);
app.delete(
  '/api/project/:projectPath/dependencies/:type/:dependencyName',
  deleteDependency,
);

// global routes
app.get('/api/global/dependencies/simple', getGlobalDependenciesSimple);
app.get('/api/global/dependencies/full', getGlobalDependencies);
app.post('/api/global/dependencies', addGlobalDependencies);
app.delete(
  '/api/global/dependencies/global/:dependencyName',
  deleteGlobalDependency,
);

// other apis
app.get('/api/explorer/:path', explorer);
app.get('/api/explorer/', explorer);
app.get('/api/available-managers', availableManagers);
app.post('/api/search/:repoName', search);
app.get('/api/info', info);
app.post('/api/log', log);

export const start = (
  host = DEFAULT_HOST,
  port = DEFAULT_PORT,
  openBrowser = false,
): void => {
  app.listen(port, host);
  if (openBrowser) {
    void open(`http://${host}:${port}`);
  }
};
