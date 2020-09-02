import express from 'express';

import {
  getGlobalDependencies,
  getGlobalDependenciesSimple,
} from '../actions/dependencies/get/getGlobalDependencies';
import { addGlobalDependencies } from '../actions/dependencies/add/addGlobalDependencies';
import { deleteGlobalDependency } from '../actions/dependencies/delete/deleteGlobalDependencies';

import { catchErrors } from '../catchErrors';

const globalDependenciesRouter = express.Router();

globalDependenciesRouter.get('/dependencies/', catchErrors(getGlobalDependencies));
globalDependenciesRouter.get('/dependencies/simple', catchErrors(getGlobalDependenciesSimple));
globalDependenciesRouter.post('/dependencies/:repoName', catchErrors(addGlobalDependencies));
globalDependenciesRouter.delete(
  '/dependencies/:repoName/:packageName',
  catchErrors(deleteGlobalDependency),
);

export { globalDependenciesRouter };
