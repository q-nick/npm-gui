const express = require('express');
const dependenciesController = require('./dependencies.controller.js');

const dependenciesRouter = express.Router();

dependenciesRouter.get('/', dependenciesController.whenGet);
dependenciesRouter.put('/:repo/', dependenciesController.whenPut);
dependenciesRouter.delete('/:repo/:name', dependenciesController.whenDelete);
// install
// dependenciesRouter.get('/install', dependenciesController.whenGetReinstallAll);
// others
dependenciesRouter.post('/updateAll', dependenciesController.whenPostUpdateAll);
dependenciesRouter.get('/reinstallAll', dependenciesController.whenGetReinstallAll);
dependenciesRouter.get('/nsp', dependenciesController.whenGetNSP);
dependenciesRouter.get('/prune', dependenciesController.whenGetPrune);
dependenciesRouter.get('/dedupe', dependenciesController.whenGetDedupe);

module.exports = dependenciesRouter;
