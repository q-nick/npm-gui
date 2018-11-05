import express from 'express';

import { getGlobalDependencies, getGlobalDependenciesSimple } from '../actions/dependencies/getGlobalDependencies';
import { addGlobalDependencies } from '../actions/dependencies/addGlobalDependencies';
import { deleteGlobalDependencies } from '../actions/dependencies/deleteGlobalDependencies';

const globalDependenciesRouter = express.Router(); // eslint-disable-line

globalDependenciesRouter.get('/', getGlobalDependencies);
globalDependenciesRouter.get('/simple', getGlobalDependencies);
globalDependenciesRouter.post('/:repoName', addGlobalDependencies);
globalDependenciesRouter.delete('/:repoName/:packageName', deleteGlobalDependencies);

export { globalDependenciesRouter };
