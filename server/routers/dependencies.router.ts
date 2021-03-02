import express from 'express';

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
} from '../actions/dependencies/install/installProjectDependencies';

import { catchErrors } from '../catchErrors';

const dependenciesRouter = express.Router({ mergeParams: true });
dependenciesRouter.get('/simple', getAllDependenciesSimple);
dependenciesRouter.get('/', catchErrors(getAllDependencies));

dependenciesRouter.post('/', catchErrors(addDependencies));
dependenciesRouter.delete('/:type/:packageName', catchErrors(deleteDependency));

const installRouter = express.Router({ mergeParams: true });
installRouter.post('/:force?', catchErrors(installDependencies));

// const getAllDependenciesRouter = express.Router({ mergeParams: true });
// getAllDependenciesRouter.get('/', catchErrors(getAllDependencies));
// getAllDependenciesRouter.get('/simple', getAllDependenciesSimple);

export {
  dependenciesRouter,
  installRouter,
  // getAllDependenciesRouter,
};
