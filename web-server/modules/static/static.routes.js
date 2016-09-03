const express = require('express');
const path = require('path');

const staticRouter = express.Router();

staticRouter.use(express.static(
  path.normalize(`${global.appRoot}/web-client`),
  {
    index: ['index.html', 'index.htm'],
  }));

staticRouter.use('/node_modules', express.static('node_modules'));

module.exports = staticRouter;
