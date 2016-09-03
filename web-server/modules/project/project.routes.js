const express = require('express');
const projectController = require('./project.controller');

const projectRouter = express.Router();

projectRouter.get('/', projectController.whenGet);
projectRouter.put('/path/:path', projectController.whenPut);

module.exports = projectRouter;
