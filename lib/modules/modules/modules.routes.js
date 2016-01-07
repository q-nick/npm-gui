var express = require('express');
var modulesRouter = express.Router();

var modulesController = require('./modules.controller');

modulesRouter.get('/', modulesController.whenGet);
modulesRouter.put('/', modulesController.whenPut);
modulesRouter.delete('/:name', modulesController.whenDelete);
//install
modulesRouter.get('/install', modulesController.whenGetInstall);

module.exports = modulesRouter;