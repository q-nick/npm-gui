var express = require('express');
var modulesRouter = express.Router();

var modulesController = require('./binModules.controller');

modulesRouter.get('/', modulesController.whenGet);

module.exports = modulesRouter;