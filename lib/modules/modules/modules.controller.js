'use strict';

module.exports.whenGet = whenGet;
module.exports.whenGetVersions = whenGetVersions;
module.exports.whenGetNSP = whenGetNSP;
module.exports.whenPut = whenPut;
module.exports.whenDelete = whenDelete;
module.exports.whenGetInstall = whenGetInstall;


var helpers = require('../../helpers/helpers.js');
var commands = require('../../helpers/commands.js');
var PackageJson = require('../../helpers/packageJson.js').PackageJson;

function whenPut(req, res) {
    var putCommand = JSON.parse(JSON.stringify(commands.npm.install));
    putCommand.args.push(req.body.key + (req.body.value ? '@' + req.body.value : ''));
    putCommand.args.push(helpers.isDevModules(req) ? '-D' : '-S');

    commands
        .run(putCommand, true)
        .then(function(data) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send();
        });
}

function whenDelete(req, res) {
    var uninstallCommand = JSON.parse(JSON.stringify(commands.npm.uninstall));
    uninstallCommand.args.push(req.params.name);
    uninstallCommand.args.push(helpers.isDevModules(req) ? '-D' : '-S');

    commands
        .run(uninstallCommand, true)
        .then(function(data) {
            ///bugfix
            //TODO tests
            var packageJson = new PackageJson();
            if (helpers.isDevModules(req)) {
                packageJson.removeDevDependence(req.params.name);
            } else {
                packageJson.removeDependence(req.params.name);
            }

            res.setHeader('Content-Type', 'application/json');
            res.status(200).send();
        });
}

//TODO: button and tests
function whenGetInstall(req, res) {
    commands
        .run(commands.npm.install, true)
        .then(function(data) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send();
        });
}

function whenGet(req, res) {
    var packageJson = new PackageJson();
    var preparedDependenciesArray = helpers.isDevModules(req) ? packageJson.getDevDependenciesArray() : packageJson.getDependenciesArray();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(preparedDependenciesArray);
}

function whenGetVersions(req, res) {
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
