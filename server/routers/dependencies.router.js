import express from 'express';

import {
  getRegularDependencies,
  getRegularDependenciesSimple,
  getDevDependencies,
  getDevDependenciesSimple,
} from '../actions/dependencies/getProjectDependencies';

import {
  addRegularDependencies,
  addDevDependencies,
} from '../actions/dependencies/addProjectDependencies';

import {
  deleteRegularDependencies,
  deleteDevDependencies,
} from '../actions/dependencies/deleteProjectDependencies';

import {
  installAsIsRegularDependencies,
  installAsIsDevDependencies,
  forceReinstallDependencies,
} from '../actions/dependencies/installProjectDependencies';

const regularDependenciesRouter = express.Router({ mergeParams: true }); // eslint-disable-line

regularDependenciesRouter.get('/', getRegularDependencies);
regularDependenciesRouter.get('/simple', getRegularDependenciesSimple);
regularDependenciesRouter.post('/:repoName/', addRegularDependencies);
regularDependenciesRouter.post('/:repoName/install', installAsIsRegularDependencies);
regularDependenciesRouter.delete('/:repoName/:packageName', deleteRegularDependencies);

const devDependenciesRouter = express.Router({ mergeParams: true }); // eslint-disable-line

devDependenciesRouter.get('/', getDevDependencies);
devDependenciesRouter.get('/simple', getDevDependenciesSimple);
devDependenciesRouter.post('/:repoName/', addDevDependencies);
devDependenciesRouter.post('/:repoName/install', installAsIsDevDependencies);
devDependenciesRouter.delete('/:repoName/:packageName', deleteDevDependencies);

const reinstallRouter = express.Router({ mergeParams: true }); // eslint-disable-line

reinstallRouter.post('/', forceReinstallDependencies);

export { devDependenciesRouter, regularDependenciesRouter, reinstallRouter };
