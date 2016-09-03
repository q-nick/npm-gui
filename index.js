'use strict';

var path = require('path');
global.appRoot = path.resolve(__dirname);

//require few modules
var express = require('express');
var app = express();
var bodyParser = require('body-parser');


//Define a port/host we want to listen to
var PORT = 1337;
var HOST = '0.0.0.0';


//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var ConsoleService = require('./web-server/service/console/console.service.js');
//modules
var modulesRoutes = require('./web-server/modules/modules/modules.routes.js');
var binModulesRoutes = require('./web-server/modules/binModules/binModules.routes.js');
var globalModulesRoutes = require('./web-server/modules/globalModules/globalModules.routes.js');
var tasksRoutes = require('./web-server/modules/tasks/tasks.routes.js');
var staticRoutes = require('./web-server/modules/static/static.routes.js');
var crawlerRoutes = require('./web-server/modules/crawler/crawler.routes.js');
var projectRoutes = require('./web-server/modules/project/project.routes.js');


//use routes
app.use('/', staticRoutes);
app.use('/modules', modulesRoutes);
app.use('/devModules', modulesRoutes);
app.use('/binModules', binModulesRoutes);
app.use('/globalModules', globalModulesRoutes);
app.use('/tasks', tasksRoutes);
app.use('/crawler', crawlerRoutes);
app.use('/project', projectRoutes);


function start(host, port) {
  //start server
  var server = app.listen(port || PORT, host || HOST, function () {
    console.log('npm-gui panel running at http://' + (host || HOST) + ':' + (port || PORT) + '/');
    console.log('\n\nI will be waiting here to help you with your work with pleasure.');
  });

  ConsoleService.bind(server);

  return server;
}

module.exports = start;
