import express from 'express';

import { getGlobalDependencies, getGlobalDependenciesSimple } from '../actions/dependencies/get/getGlobalDependencies';
import { addGlobalDependencies } from '../actions/dependencies/add/addGlobalDependencies';
import { deleteGlobalDependencies } from '../actions/dependencies/delete/deleteGlobalDependencies';

const globalDependenciesRouter = express.Router(); // eslint-disable-line

globalDependenciesRouter.get('/', getGlobalDependencies);
globalDependenciesRouter.get('/simple', getGlobalDependenciesSimple);
globalDependenciesRouter.post('/:repoName', addGlobalDependencies);
globalDependenciesRouter.delete('/:repoName/:packageName', deleteGlobalDependencies);

export { globalDependenciesRouter };
