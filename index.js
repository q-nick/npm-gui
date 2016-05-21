'use strict';
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


//modules
var modulesRoutes = require('./lib/modules/modules/modules.routes.js');
var binModulesRoutes = require('./lib/modules/binModules/binModules.routes.js');
var globalModulesRoutes = require('./lib/modules/globalModules/globalModules.routes.js');
var tasksRoutes = require('./lib/modules/tasks/tasks.routes.js');
var staticRoutes = require('./lib/modules/static/static.routes.js');
var consoleController = require('./lib/modules/console/console.controller.js');


//use routes
app.use('/', staticRoutes);
app.use('/modules', modulesRoutes);
app.use('/devModules', modulesRoutes);
app.use('/binModules', binModulesRoutes);
app.use('/globalModules', globalModulesRoutes);
app.use('/tasks', tasksRoutes);


function start(host, port) {
    //start server
    var server = app.listen(port || PORT, host || HOST, function() {
        console.log('npm-gui panel running at http://' + (host || HOST) + ':' + (port || PORT) + '/');
        console.log('\n\nI will be waiting here to help you with your work with pleasure.');
    });

    consoleController.bind(server);

    return server;
}

module.exports = start;
