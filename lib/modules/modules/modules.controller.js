'use strict';

module.exports.whenGet = whenGet;
module.exports.whenGetVersions = whenGetVersions;
module.exports.whenGetNSP = whenGetNSP;
module.exports.whenPut = whenPut;
module.exports.whenDelete = whenDelete;
module.exports.whenGetInstall = whenGetInstall;

var fs = require('fs');

var helpers = require('../../helpers/helpers.js');
var commands = require('../../helpers/commands.js');
var PackageJson = require('../../helpers/packageJson.js').PackageJson;

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
    var packageJson = new PackageJson();
    var preparedDependenciesArray = helpers.isDevModules(req) ? packageJson.getDevDependenciesArray() : packageJson.getDependenciesArray();

    for (var i = 0; i < preparedDependenciesArray.length; i++) {
        preparedDependenciesArray[i].repo = 'npm';
    }

    //bower support
    if (fs.existsSync(helpers.getProjectPath() + '/bower.json')) {
        var bowerJson = new PackageJson(null, helpers.getProjectPath() + '/bower.json');
        var preparedDependenciesArrayBower = helpers.isDevModules(req) ? bowerJson.getDevDependenciesArray() : bowerJson.getDependenciesArray();

        for (var i = 0; i < preparedDependenciesArrayBower.length; i++) {
            preparedDependenciesArrayBower[i].repo = 'bower';
        }

        preparedDependenciesArray = preparedDependenciesArray.concat(preparedDependenciesArrayBower);
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(preparedDependenciesArray);
}

function extend(fromm, to) {
    for (var key in fromm) {
        if (fromm.hasOwnProperty(key)) {
            to[key] = fromm[key];
        }
    }
}

function getBowerDependenciesVersions() {
    return new Promise(function(resolve, reject) { //bower support
        if (fs.existsSync(helpers.getProjectPath() + '/bower.json')) {
            commands
                .run(commands.bower.ls)
                .then(function(data) {
                    var dependencies = helpers.JSONparse(data.stdout).dependencies;
                    var dependenciesToReturn = {};
                    for (var key in dependencies) {
                        if (dependencies.hasOwnProperty(key) && dependencies[key].pkgMeta) {
                            dependenciesToReturn[key] = {
                                current: dependencies[key].pkgMeta.version,
                                version: dependencies[key].pkgMeta.version
                            };
                            if (dependencies[key].update.target !== dependenciesToReturn[key].current) {
                                dependenciesToReturn[key].wanted = dependencies[key].update.target;
                            }
                            if (dependencies[key].update.latest !== dependenciesToReturn[key].current) {
                                dependenciesToReturn[key].latest = dependencies[key].update.latest;
                            }
                        }
                    }
                    resolve(dependenciesToReturn);
                });
        } else {
            //no bower
            resolve(null);
        }
    });
}

function getNPMDependenciesVersions() {
    return new Promise(function(resolve, reject) {
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
                        if (outdated[key].latest !== outdated[key].current) {
                            dependencies[key].latest = outdated[key].latest;
                        }
                    }
                }
                resolve(dependencies);
            });
    });
}

function whenGetVersions(req, res) {
    var dependencies = {};

    getNPMDependenciesVersions()
        .then(function(data) {
            extend(data, dependencies);
        })
        .then(function() {
            return getBowerDependenciesVersions();
        })
        .then(function(data) {
            if (data) {
                extend(data, dependencies);
            }
        })
        .then(function() {
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
