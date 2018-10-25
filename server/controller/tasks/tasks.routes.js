import express from 'express';
import tasksController from './tasks.controller';

const tasksRouter = express.Router(); // eslint-disable-line

tasksRouter.get('/', tasksController.whenGet);
tasksRouter.put('/', tasksController.whenPut);
tasksRouter.delete('/:name', tasksController.whenDelete);
// install
tasksRouter.post('/:name', tasksController.whenPost);
// other
tasksRouter.get('/:name/help', tasksController.whenGetHelp);

export default tasksRouter;
