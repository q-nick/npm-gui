import * as express from 'express';

import {
  getGlobalDependencies,
  getGlobalDependenciesSimple } from '../actions/dependencies/get/getGlobalDependencies';
import { addGlobalDependencies } from '../actions/dependencies/add/addGlobalDependencies';
import { deleteGlobalDependency } from '../actions/dependencies/delete/deleteGlobalDependencies';

import { catchErrors } from '../catchErrors';

const globalDependenciesRouter = express.Router();

globalDependenciesRouter.get('/', catchErrors(getGlobalDependencies));
globalDependenciesRouter.get('/simple', catchErrors(getGlobalDependenciesSimple));
globalDependenciesRouter.post('/:repoName', catchErrors(addGlobalDependencies));
globalDependenciesRouter.delete('/:repoName/:packageName', catchErrors(deleteGlobalDependency));

export { globalDependenciesRouter };
