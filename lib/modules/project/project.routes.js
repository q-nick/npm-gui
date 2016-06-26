var express = require('express');
var projectRouter = express.Router();

var projectController = require('./project.controller');

projectRouter.get('/', projectController.whenGet);

module.exports = projectRouter;
