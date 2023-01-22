/* eslint-disable import/max-dependencies */
import open from 'open';

import { availableManagers } from './actions/available-managers/available-managers';
import { addGlobalDependencies } from './actions/dependencies/add/add-global-dependencies';
import { addDependencies } from './actions/dependencies/add/add-project-dependencies';
import { deleteGlobalDependency } from './actions/dependencies/delete/delete-global-dependencies';
import { deleteDependencies } from './actions/dependencies/delete/delete-project-dependencies';
import { getDependenciesDetails } from './actions/dependencies/extras/dependency-details';
import { getDependenciesScore } from './actions/dependencies/extras/dependency-score';
import {
  getGlobalDependencies,
  getGlobalDependenciesSimple,
} from './actions/dependencies/get/get-global-dependencies';
import {
  getAllDependencies,
  getAllDependenciesSimple,
} from './actions/dependencies/get/get-project-dependencies';
import {
  installDependencies,
  installDependenciesForceManager,
} from './actions/dependencies/install/install-project-dependencies';
import { explorer } from './actions/explorer/explorer';
import { info } from './actions/info/info';
import { search } from './actions/search/search';
import { projectPathAndManagerMiddleware } from './middlewares/project-path-and-manager.middleware';
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
  installDependenciesForceManager,
);
app.post('/api/project/:projectPath/dependencies/install', installDependencies);
app.post('/api/project/:projectPath/dependencies/:type', addDependencies);
app.delete('/api/project/:projectPath/dependencies/:type', deleteDependencies);

// global routes
app.get('/api/global/dependencies/simple', getGlobalDependenciesSimple);
app.get('/api/global/dependencies/full', getGlobalDependencies);
app.post('/api/global/dependencies', addGlobalDependencies);
app.delete(
  '/api/global/dependencies/global/:dependencyName',
  deleteGlobalDependency,
);

// dependencies extra apis
app.get('/api/score/:dependenciesName', getDependenciesScore);
app.get(
  '/api/details/:manager/:dependenciesNameVersion',
  getDependenciesDetails,
);

// other apis
app.get('/api/explorer/:path', explorer);
app.get('/api/explorer/', explorer);
app.get('/api/available-managers', availableManagers);
app.post('/api/search/:repoName', search);
app.get('/api/info/:id', info);

/* istanbul ignore next */
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

// only for parcel?
// eslint-disable-next-line import/no-commonjs
module.exports = { start, app };
