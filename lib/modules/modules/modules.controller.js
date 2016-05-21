'use strict';

var exec = require('child_process').exec;
var helpers = require('../../helpers/helpers.js');
var commands = require('../../helpers/commands.js');
var PackageJson = require('../../helpers/packageJson.js').PackageJson;
var consoleSocket = require('../console/console.controller.js');

function whenPut(req, res) {
    var saveArg = helpers.isDevModules(req) ? '-D' : '-S';

    consoleSocket.send('start npm install ' + saveArg + ' ' + req.body.key + (req.body.value ? '@' + req.body.value : '') + '\n');

    var output = '';
    var child = exec('npm install ' + saveArg + ' ' + req.body.key + (req.body.value ? '@' + req.body.value : ''),
        function(error, stdout, stderr) {
            output = output + '\n' + stdout + '\n' + stderr;
            if (error !== null) {
                //output = output + error;
            }
        });

    helpers.bindChildStdToConsole(child);

    child.on('close', function() {
        res.status(200).send('<textarea style="width:800px;height:400px;">' + output + '</textarea>');
    });
}

function whenDelete(req, res) {
    var saveArg = helpers.isDevModules(req) ? '-D' : '-S';

    consoleSocket.send('start npm rm ' + saveArg + ' ' + req.params.name + '\n');

    var output = '';
    var child = exec('npm uninstall --save ' + req.params.name,
        function(error, stdout, stderr) {
            output = output + '\n' + stdout + '\n' + stderr;
            if (error !== null) {
                //output = output + error;
            }
            ///bugfix
            var packageJson = new PackageJson();
            if (helpers.isDevModules(req)) {
                packageJson.removeDevDependence(req.params.name);
            } else {
                packageJson.removeDependence(req.params.name);
            }
        });

    helpers.bindChildStdToConsole(child);

    child.on('close', function() {
        res.status(200).send('<textarea style="width:800px;height:400px;">' + output + '</textarea>');
    });
}

function whenGetInstall(req, res) {
    consoleSocket.send('start npm install' + '\n');

    var output = '';
    var child = exec('npm install',
        function(error, stdout, stderr) {
            output = output + '\n' + stdout + '\n' + stderr;
            if (error !== null) {
                //output = output + error;
            }
        });

    helpers.bindChildStdToConsole(child);

    child.on('close', function() {
        res.status(200).send('<textarea style="width:800px;height:400px;">' + output + '</textarea>');
    });
}

function whenGet(req, res) {
    if (helpers.isGlobalModules(req)) {
        whenGetGlobal(req, res)
    } else {
        whenGetPackage(req, res);
    }
}

function whenGetGlobal(req, res) {
    commands
        .run(commands.npm.lsGlobal)
        .then(function(data) {
            var dependencies = helpers.JSONparse(data.stdout).dependencies;
            var preparedDependenciesArray = [];
            helpers.buildArrayFromObject(dependencies, preparedDependenciesArray, 'key', 'value');

            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(preparedDependenciesArray);
        });
}

function whenGetPackage(req, res) {
    var packageJson = new PackageJson();
    var preparedDependenciesArray = helpers.isDevModules(req) ? packageJson.getDevDependenciesArray() : packageJson.getDependenciesArray();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(preparedDependenciesArray);
}

function whenGetVersions(req, res) {
    if (helpers.isGlobalModules(req)) {
        whenGetVersionsGlobal(req, res)
    } else {
        whenGetVersionsPackage(req, res);
    }
}

function whenGetVersionsPackage(req, res) {
    var dependencies = null;

    commands
        .run(commands.npm.ls)
        .then(function(data) {
            dependencies = helpers.JSONparse(data.stdout).dependencies;
            return commands
                .run(commands.npm.outdated);
        })
        .then(function(data) {
            var outdated = helpers.JSONparse(data.stdout);
            for (var key in outdated) {
                if (outdated.hasOwnProperty(key)) {
                    if (outdated[key].wanted !== outdated[key].current) {
                        dependencies[key].wanted = outdated[key].wanted;
                    }
                    dependencies[key].latest = outdated[key].latest;
                }
            }
            res.status(200).send(dependencies);
        });
}

function whenGetVersionsGlobal(req, res) {
    var dependencies = null;

    commands
        .run(commands.npm.lsGlobal)
        .then(function(data) {
            dependencies = helpers.JSONparse(data.stdout).dependencies;
            return commands
                .run(commands.npm.outdatedGlobal);
        })
        .then(function(data) {
            var outdated = helpers.JSONparse(data.stdout);
            for (var key in outdated) {
                if (outdated.hasOwnProperty(key)) {
                    if (outdated[key].wanted !== outdated[key].current) {
                        dependencies[key].wanted = outdated[key].wanted;
                    }
                    dependencies[key].latest = outdated[key].latest;
                }
            }
            res.status(200).send(dependencies);
        });
}

function whenGetNSP(req, res) {
    commands
        .run(commands.nsp.check)
        .then(function(data) {
            var dependencies = {};
            if (data.stderr) {
                helpers.buildObjectFromArray(helpers.JSONparse(data.stderr), dependencies, 'module');
            }
            res.status(200).send(dependencies);
        });
}

module.exports.whenGet = whenGet;
module.exports.whenGetVersions = whenGetVersions;
module.exports.whenGetNSP = whenGetNSP;
module.exports.whenPut = whenPut;
module.exports.whenDelete = whenDelete;
module.exports.whenGetInstall = whenGetInstall;
