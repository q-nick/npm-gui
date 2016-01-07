var express = require('express');
var tasksRouter = express.Router();

var tasksController = require('./tasks.controller');

tasksRouter.get('/', tasksController.whenGet);
tasksRouter.put('/', tasksController.whenPut);
tasksRouter.delete('/:name', tasksController.whenDelete);
//install
tasksRouter.post('/:name', tasksController.whenPost);

module.exports = tasksRouter;