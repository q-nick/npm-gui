'use strict';

module.exports.whenGet = whenGet;
module.exports.whenGetNSP = whenGetNSP;
module.exports.whenPut = whenPut;
module.exports.whenDelete = whenDelete;
module.exports.whenGetInstall = whenGetInstall;
module.exports.whenPostUpdateAll = whenPostUpdateAll;
module.exports.whenGetPrune = whenGetPrune;
module.exports.whenGetDedupe = whenGetDedupe;

var fs = require('fs');

var helpers = require('../../helpers/helpers.js');
var commands = require('../../helpers/commands.js');
var PackageJson = require('../../helpers/packageJson.js').PackageJson;
var ModulesService = require('./modules.service.js');

function whenPut(req, res) {
    var putCommand = JSON.parse(JSON.stringify(commands[req.params.repo].install));
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
    var uninstallCommand = JSON.parse(JSON.stringify(commands[req.params.repo].uninstall));
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
    var preparedDependenciesArray = ModulesService.getModules(helpers.isDevModules(req));

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(preparedDependenciesArray);
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

function whenGetPrune(req, res) {
    commands
        .run(commands.npm.prune)
        .then(function(data) {
            res.status(200).send({});
        });
}

function whenGetDedupe(req, res) {
    commands
        .run(commands.npm.dedupe)
        .then(function(data) {
            res.status(200).send({});
        });
}

function whenPostUpdateAll(req, res) {
    var type = req.body.type;
    //TODO refactor too fat method
    //get all versions
    var dependencies = {};

    getNPMDependenciesVersions()
        .then(function(versions) {
            if (versions) {
                var packageJson = new PackageJson();

                var depsInPackageJson = helpers.isDevModules(req) ? packageJson.getDevDependencies() : packageJson.getDependencies();

                for (var key in depsInPackageJson) {
                    if (depsInPackageJson.hasOwnProperty(key)) {
                        if (depsInPackageJson[key].slice(1) !== versions[key].version) {
                            depsInPackageJson[key] = depsInPackageJson[key].replace(/[.\d]+/g, versions[key].version);
                        }
                        if (versions[key] && versions[key][type]) {
                            depsInPackageJson[key] = depsInPackageJson[key].replace(/[.\d]+/g, versions[key][type]);
                        }
                    }
                }

                //save file
                packageJson.save();
                console.log('npm saved');
                //run install command
                return commands.run(commands.npm.update);
            }
        })
        .then(function() {
            return getBowerDependenciesVersions();
        })
        .then(function(versions) {
            //have to change type name
            if (type = 'wanted') {
                type = 'target'
            }
            if (versions) {
                var packageJson = new PackageJson(null, '/bower.json');

                var depsInPackageJson = helpers.isDevModules(req) ? packageJson.getDevDependencies() : packageJson.getDependencies();

                for (var key in depsInPackageJson) {
                    if (depsInPackageJson.hasOwnProperty(key)) {
                        if (depsInPackageJson[key].slice(1) !== versions[key].version) {
                            depsInPackageJson[key] = depsInPackageJson[key].replace(/[.\d]+/g, versions[key].version);
                        }
                        if (versions[key] && versions[key][type]) {
                            depsInPackageJson[key] = depsInPackageJson[key].replace(/[.\d]+/g, versions[key].update[type]);
                        }
                    }
                }

                //save file
                packageJson.save();
                console.log('bower saved');
                //run install command
                return commands.run(commands.npm.update);
            }
        })
        .then(function() {
            res.status(200).send({});
        })
}
