import * as express from 'express';

import {
  getAllDependenciesSimple,
  getAllDependencies,
} from '../actions/dependencies/get/getProjectDependencies';

import {
  addDependencies,
} from '../actions/dependencies/add/addProjectDependencies';

import {
  deleteDependency,
} from '../actions/dependencies/delete/deleteProjectDependencies';

import {
  installAsIsRegularDependencies,
  forceReinstallDependencies,
} from '../actions/dependencies/install/installProjectDependencies';

const dependenciesRouter = express.Router({ mergeParams: true }); // eslint-disable-line
dependenciesRouter.post('/:repoName/', addDependencies);
dependenciesRouter.post('/:repoName/install', installAsIsRegularDependencies);
dependenciesRouter.delete('/:repoName/:packageName', deleteDependency);

const reinstallRouter = express.Router({ mergeParams: true });
reinstallRouter.post('/', forceReinstallDependencies);

const getAllDependenciesRouter = express.Router({ mergeParams: true });
getAllDependenciesRouter.get('/', getAllDependencies);
getAllDependenciesRouter.get('/simple', getAllDependenciesSimple);

export {
  dependenciesRouter,
  reinstallRouter,
  getAllDependenciesRouter,
};
