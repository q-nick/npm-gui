import * as express from 'express';

import {
  dependenciesRouter,
  reinstallRouter,
  getAllDependenciesRouter,
} from './dependencies.router';
import { scriptsRouter } from './scripts.router';

const projectRouter = express.Router();

projectRouter.use('/:projectPath/dependencies/reinstall', reinstallRouter);
projectRouter.use('/:projectPath/dependencies/:type', dependenciesRouter);
projectRouter.use('/:projectPath/dependencies', getAllDependenciesRouter);
projectRouter.use('/:projectPath/scripts', scriptsRouter);

export { projectRouter };
