import * as express from 'express';

import {
  getGlobalDependencies,
  getGlobalDependenciesSimple } from '../actions/dependencies/get/getGlobalDependencies';
import { addGlobalDependencies } from '../actions/dependencies/add/addGlobalDependencies';
import { deleteGlobalDependency } from '../actions/dependencies/delete/deleteGlobalDependencies';

const globalDependenciesRouter = express.Router();

globalDependenciesRouter.get('/', getGlobalDependencies);
globalDependenciesRouter.get('/simple', getGlobalDependenciesSimple);
globalDependenciesRouter.post('/:repoName', addGlobalDependencies);
globalDependenciesRouter.delete('/:repoName/:packageName', deleteGlobalDependency);

export { globalDependenciesRouter };
