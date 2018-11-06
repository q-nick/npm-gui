import express from 'express';
import {
  regularDependenciesRouter,
  devDependenciesRouter,
  reinstallRouter,
} from './dependencies.router';
import { globalDependenciesRouter } from './globalDependencies.router';
import { scriptsRouter } from './scripts.router';

const projectRouter = express.Router(); // eslint-disable-line

projectRouter.use('/:projectPath/dependencies/global', globalDependenciesRouter);
projectRouter.use('/:projectPath/dependencies/regular', regularDependenciesRouter);
projectRouter.use('/:projectPath/dependencies/dev', devDependenciesRouter);
projectRouter.use('/:projectPath/dependencies/reinstall', reinstallRouter);
projectRouter.use('/:projectPath/scripts', scriptsRouter);

export { projectRouter };
