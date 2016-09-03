const express = require('express');
const tasksController = require('./tasks.controller');

const tasksRouter = express.Router();

tasksRouter.get('/', tasksController.whenGet);
tasksRouter.put('/', tasksController.whenPut);
tasksRouter.delete('/:name', tasksController.whenDelete);
// install
tasksRouter.post('/:name', tasksController.whenPost);
// other
tasksRouter.get('/:name/help', tasksController.whenGetHelp);

module.exports = tasksRouter;
