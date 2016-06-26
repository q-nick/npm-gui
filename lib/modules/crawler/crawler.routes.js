var express = require('express');
var crawlerRouter = express.Router();

var crawlerController = require('./crawler.controller');

crawlerRouter.get('/:path', crawlerController.whenGet);

module.exports = crawlerRouter;
