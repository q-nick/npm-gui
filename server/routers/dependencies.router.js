import express from 'express';

import {
  getRegularDependencies,
  getDevDependencies,
} from '../actions/dependencies/getProjectDependencies';

import {
  addRegularDependencies,
  addDevDependencies,
} from '../actions/dependencies/addProjectDependencies';

import {
  deleteRegularDependencies,
  deleteDevDependencies,
} from '../actions/dependencies/deleteProjectDependencies';

const regularDependenciesRouter = express.Router({ mergeParams: true }); // eslint-disable-line

regularDependenciesRouter.get('/', getRegularDependencies);
regularDependenciesRouter.post('/:repoName/', addRegularDependencies);
regularDependenciesRouter.delete('/:repoName/:packageName', deleteRegularDependencies);


const devDependenciesRouter = express.Router({ mergeParams: true }); // eslint-disable-line

devDependenciesRouter.get('/', getDevDependencies);
devDependenciesRouter.post('/:repoName/', addDevDependencies);
devDependenciesRouter.delete('/:repoName/:packageName', deleteDevDependencies);

export { devDependenciesRouter, regularDependenciesRouter };
