import express from 'express';
import modulesController from './dependenciesBin.controller.js';

const modulesRouter = express.Router(); // eslint-disable-line
modulesRouter.get('/', modulesController.whenGet);

export default modulesRouter;
