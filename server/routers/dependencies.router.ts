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
  installDependencies,
  forceReinstallDependencies,
} from '../actions/dependencies/install/installProjectDependencies';

const dependenciesRouter = express.Router({ mergeParams: true }); // eslint-disable-line
dependenciesRouter.post('/:repoName/', addDependencies);
dependenciesRouter.delete('/:repoName/:packageName', deleteDependency);

const installRouter = express.Router({ mergeParams: true });
installRouter.post('/', installDependencies);
installRouter.post('/force', forceReinstallDependencies);

const getAllDependenciesRouter = express.Router({ mergeParams: true });
getAllDependenciesRouter.get('/', getAllDependencies);
getAllDependenciesRouter.get('/simple', getAllDependenciesSimple);

export {
  dependenciesRouter,
  installRouter,
  getAllDependenciesRouter,
};
