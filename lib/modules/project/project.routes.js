var express = require('express');
var projectRouter = express.Router();

var projectController = require('./project.controller');

projectRouter.get('/', projectController.whenGet);
projectRouter.put('/path/:path', projectController.whenPut);

module.exports = projectRouter;
