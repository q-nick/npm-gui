const express = require('express');
const modulesController = require('./dependenciesBin.controller.js');

const modulesRouter = express.Router();
modulesRouter.get('/', modulesController.whenGet);

module.exports = modulesRouter;
