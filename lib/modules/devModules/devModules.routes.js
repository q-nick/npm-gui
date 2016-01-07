var express = require('express');
var devModulesRouter = express.Router();

var devModulesController = require('./devModules.controller');

devModulesRouter.get('/', devModulesController.whenGet);
devModulesRouter.put('/', devModulesController.whenPut);
devModulesRouter.delete('/:name', devModulesController.whenDelete);
//install
devModulesRouter.get('/install', devModulesController.whenGetInstall);

module.exports = devModulesRouter;