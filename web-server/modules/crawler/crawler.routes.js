const express = require('express');
const crawlerController = require('./crawler.controller');

const crawlerRouter = express.Router();
crawlerRouter.get('/:path', crawlerController.whenGet);

module.exports = crawlerRouter;
