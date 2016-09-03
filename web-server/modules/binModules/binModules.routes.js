const express = require('express');
const modulesController = require('./binModules.controller');

const modulesRouter = express.Router();
modulesRouter.get('/', modulesController.whenGet);

module.exports = modulesRouter;
