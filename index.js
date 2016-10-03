const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const opn = require('opn');

global.appRoot = path.resolve(__dirname);
const app = express();


// Define a port/host we want to listen to
const PORT = 1337;
const HOST = '0.0.0.0';


// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

const ConsoleService = require('./web-server/service/console/console.service.js');
// modules
const dependenciesRoutes = require('./web-server/modules/dependencies/dependencies.routes.js');
const dependenciesBinRoutes
  = require('./web-server/modules/dependenciesBin/dependenciesBin.routes.js');
const globalPackagesRoutes
  = require('./web-server/modules/globalPackages/globalPackages.routes.js');
const tasksRoutes = require('./web-server/modules/tasks/tasks.routes.js');
const staticRoutes = require('./web-server/modules/static/static.routes.js');
const crawlerRoutes = require('./web-server/modules/crawler/crawler.routes.js');
const projectRoutes = require('./web-server/modules/project/project.routes.js');


// use routes
app.use('/', staticRoutes);
app.use('/dependencies', dependenciesRoutes);
app.use('/dependenciesDev', dependenciesRoutes);
app.use('/dependenciesBin', dependenciesBinRoutes);
app.use('/globalPackages', globalPackagesRoutes);
app.use('/tasks', tasksRoutes);
app.use('/crawler', crawlerRoutes);
app.use('/project', projectRoutes);


function start(host, port) {
  // start server
  const server = app.listen(port || PORT, host || HOST, () => {
    console.log(`npm-gui panel running at http://${(host || HOST)}:${(port || PORT)}/`);
    opn(`http://${(host || HOST)}:${(port || PORT)}`);
  });

  ConsoleService.bind(server);

  return server;
}

module.exports = start;
