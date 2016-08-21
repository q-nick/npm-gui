'use strict';

module.exports.whenGet = whenGet;
module.exports.whenGetVersions = whenGetVersions;
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
    helpers
        .isBowerAvailable()
        .then(function() {
            var bowerJson = new PackageJson(null, '/bower.json');
            var preparedDependenciesArrayBower = helpers.isDevModules(req) ? bowerJson.getDevDependenciesArray() : bowerJson.getDependenciesArray();

            for (var i = 0; i < preparedDependenciesArrayBower.length; i++) {
                preparedDependenciesArrayBower[i].repo = 'bower';
            }

            preparedDependenciesArray = preparedDependenciesArray.concat(preparedDependenciesArrayBower);
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(preparedDependenciesArray);
        })
        .catch(function(err) {
            console.log('no bower', err)
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(preparedDependenciesArray);
        })

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
        helpers
            .isBowerAvailable()
            .then(function() {
                return commands.run(commands.bower.ls);
            })
            .then(function(data) {
                var dependencies = helpers.JSONparse(data.stdout).dependencies;
                var dependenciesToReturn = {};
                for (var key in dependencies) {
                    if (dependencies.hasOwnProperty(key) && dependencies[key].pkgMeta) {
                        dependenciesToReturn[key] = {
                            current: dependencies[key].endpoint.target.slice(1),
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
            })
            .catch(function(err) {
                console.log('Bower support problem');
                resolve(null);
            })
    });
}

function getNPMDependenciesVersions() {
    return new Promise(function(resolve, reject) {
        var dependencies = null;
        helpers
            .isNPMAvailable()
            .then(function() {
                return commands.run(commands.npm.ls)
            })
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
                //all ok
                resolve(dependencies);
            })
            .catch(function(err) {
                console.log('NPM support problem');
                //any error?
                resolve(null);
            });
    });
}

function whenGetVersions(req, res) {
    var dependencies = {};

    getNPMDependenciesVersions()
        .then(function(data) {
            if (data) {
                extend(data, dependencies);
            }
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
