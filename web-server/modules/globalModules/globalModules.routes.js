var express = require('express');
var globalModulesRouter = express.Router();

var globalModulesController = require('./globalModules.controller');

globalModulesRouter.get('/', globalModulesController.whenGet);
globalModulesRouter.put('/', globalModulesController.whenPut);
globalModulesRouter.delete('/:name', globalModulesController.whenDelete);
//others
globalModulesRouter.get('/versions', globalModulesController.whenGetVersions);
globalModulesRouter.get('/nsp', globalModulesController.whenGetNSP);

module.exports = globalModulesRouter;
