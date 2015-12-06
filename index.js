'use strict';
//require few modules
var express = require('express');
var app = express();
var bodyParser = require('body-parser');


//Define a port/host we want to listen to
const PORT = 1337;
const HOST = '0.0.0.0';


//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


//controllers
var modulesController = require('./lib/controller/modules.controller.js');
var devModulesController = require('./lib/controller/devModules.controller.js');
var tasksController = require('./lib/controller/tasks.controller.js');
var staticController = require('./lib/controller/static.controller.js');
var consoleController = require('./lib/controller/console.controller.js');

//use route
app.use('/', staticController);
app.use('/modules', modulesController);
app.use('/devModules', devModulesController);
app.use('/tasks', tasksController);

function start(port, host) {
    //start server
    var server = app.listen(port || PORT, host || HOST, function() {
        console.log('npm-gui panel running at http://' + (host ||HOST) + ':' + (port || PORT) + '/');
        console.log('\n\nI will be waiting here to help you with your work with pleasure.');
    });

    consoleController.bind(server);

    return server;
}

module.exports = start;