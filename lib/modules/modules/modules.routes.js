var express = require('express');
var modulesRouter = express.Router();

var modulesController = require('./modules.controller');

modulesRouter.get('/', modulesController.whenGet);
modulesRouter.put('/:repo/', modulesController.whenPut);
modulesRouter.delete('/:repo/:name', modulesController.whenDelete);
//install
modulesRouter.get('/install', modulesController.whenGetInstall);
//others
modulesRouter.post('/updateAll', modulesController.whenPostUpdateAll);
modulesRouter.get('/nsp', modulesController.whenGetNSP);
modulesRouter.get('/prune', modulesController.whenGetPrune);
modulesRouter.get('/dedupe', modulesController.whenGetDedupe);

module.exports = modulesRouter;
