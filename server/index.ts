import { addGlobalDependencies } from './actions/dependencies/add/addGlobalDependencies';
import { addDependencies } from './actions/dependencies/add/addProjectDependencies';
import { deleteGlobalDependency } from './actions/dependencies/delete/deleteGlobalDependencies';
import { deleteDependency2 } from './actions/dependencies/delete/deleteProjectDependencies';
import { getGlobalDependencies, getGlobalDependenciesSimple } from './actions/dependencies/get/getGlobalDependencies';
import { getAllDependencies, getAllDependenciesSimple } from './actions/dependencies/get/getProjectDependencies';
import { installDependencies } from './actions/dependencies/install/installProjectDependencies';
import { explorer } from './actions/explorer/explorer';
import { info } from './actions/info/info';
import { log } from './actions/log/log';
import { search } from './actions/search/search';
import { projectPathAndNpmYarnMiddleware } from './middlewares/projectPathAndNpmYarnMiddleware';
import { Server } from './simple-express';

const DEFAULT_PORT = 3000;

export const app = new Server();

app.use('/api/project/:projectPath/', projectPathAndNpmYarnMiddleware);

app.get('/api/project/:projectPath/dependencies/simple', getAllDependenciesSimple); // fast list
app.get('/api/project/:projectPath/dependencies/full', getAllDependencies);
app.post('/api/project/:projectPath/dependencies/install/:force', installDependencies); // install/hard install dependencies in project
app.post('/api/project/:projectPath/dependencies/install', installDependencies); // install/hard install dependencies in project
app.post('/api/project/:projectPath/dependencies/:type', addDependencies); // add dependencies
app.delete('/api/project/:projectPath/dependencies/:type/:dependencyName', deleteDependency2); // remove dependency

// global routes
app.get('/api/global/dependencies/simple', getGlobalDependenciesSimple); // fast list global
app.get('/api/global/dependencies/full', getGlobalDependencies); // full list global
app.post('/api/global/dependencies', addGlobalDependencies); // add dependencies global
app.delete('/api/global/dependencies/global/:dependencyName', deleteGlobalDependency); // remove dependency global

// other apis
app.get('/api/explorer/:path', explorer);
app.get('/api/explorer/', explorer);
app.post('/api/search/:repoName', search);
app.get('/api/info', info);
app.get('/api/log', log);

export function start(_host?: string, port = DEFAULT_PORT): void {
  app.listen(port);
}
