import express from 'express';

import {
  dependenciesRouter,
  installRouter,
  getAllDependenciesRouter,
} from './dependencies.router';
// import { scriptsRouter } from './scripts.router';

const projectRouter = express.Router();

projectRouter.use('/:projectPath/dependencies/install', installRouter);
projectRouter.use('/:projectPath/dependencies/:type', dependenciesRouter);
projectRouter.use('/:projectPath/dependencies', getAllDependenciesRouter);

// projectRouter.use('/:projectPath/scripts', scriptsRouter);

export { projectRouter };
