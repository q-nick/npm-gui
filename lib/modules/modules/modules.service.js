'use strict';

var Rx = require('rx');
var PackageJson = require('../../helpers/packageJson.js').PackageJson;
var commands = require('../../helpers/commands.js');
var helpers = require('../../helpers/helpers.js');

module.exports.getModules = getModules;
module.exports.updateModulesInfo = updateModulesInfo;

var isRepoAvailable = {
    npm: true,
    bower: true,
};

var modules = {
    lastId: null,
    all: {

    }
};

var devModules = {
    lastId: null,
    all: []
};

var globalModules = {
    lastId: null,
    all: []
};

updateModulesInfo();
// called on client request
// and in return we will notify if something has changed
setInterval(function() {
    updateModulesInfo();
}, 90000);

//cron job every 30s and on init
function checkReposAvailability() {
    return Rx.Observable.create(function(observer) {
        var sourceBower = helpers.isBowerAvailable();
        sourceBower
            .subscribe(function() {
                isRepoAvailable.bower = true;
            }, function() {
                isRepoAvailable.bower = false;
            })

        var sourceNPM = helpers.isNPMAvailable();
        sourceNPM
            .subscribe(function() {
                isRepoAvailable.npm = true;
            }, function() {
                isRepoAvailable.npm = false;
            });

        var source = sourceBower.merge(sourceNPM);

        source
            .subscribe(function() {}, function() {}, function() {
                observer.onCompleted();
            });
    });
}

function checkVersionBower(dependencies) {
    return Rx.Observable.create(function(observer) {
        commands
            .run(commands.bower.ls)
            .then(function(data) {
                var dependenciesListed = helpers.JSONparse(data.stdout).dependencies;
                for (var key in dependenciesListed) {
                    if (dependenciesListed.hasOwnProperty(key) && dependenciesListed[key].pkgMeta) {
                        helpers.setInArrayByRepoAndKey('bower', 'key', key, 'version', dependenciesListed[key].pkgMeta.version, dependencies);

                        if (dependenciesListed[key].update.target !== dependenciesListed[key].pkgMeta.version) {
                            helpers.setInArrayByRepoAndKey('bower', 'key', key, 'wanted', dependenciesListed[key].update.target, dependencies);
                        }
                        if (dependenciesListed[key].update.latest !== dependenciesListed[key].pkgMeta.version) {
                            helpers.setInArrayByRepoAndKey('bower', 'key', key, 'latest', dependenciesListed[key].update.latest, dependencies);
                        }
                    }
                }
                observer.onNext(dependencies);
                observer.onCompleted();
            })
            .catch(function(err) {
                console.error('Bower support problem', err);
                observer.onCompleted();
            });
    });
}

function checkVersionNPM(dependencies) {
    return Rx.Observable.create(function(observer) {
        commands
            .run(commands.npm.ls)
            .then(function(data) {
                //ls command result
                var dependenciesListed = helpers.JSONparse(data.stdout).dependencies;
                for (var key in dependenciesListed) {
                    if (dependenciesListed.hasOwnProperty(key)) {
                        helpers.setInArrayByRepoAndKey('npm', 'key', key, 'version', dependenciesListed[key].version, dependencies);
                    }
                }

                return commands
                    .run(commands.npm.outdated);
            })
            .then(function(data) {
                //outdated command result
                var dependenciesOutdated = helpers.JSONparse(data.stdout);
                for (var key in dependenciesOutdated) {
                    if (dependenciesOutdated.hasOwnProperty(key)) {
                        if (dependenciesOutdated[key].wanted !== dependenciesOutdated[key].current) {
                            helpers.setInArrayByRepoAndKey('npm', 'key', key, 'wanted', dependenciesOutdated[key].wanted, dependencies);
                        }
                        if (dependenciesOutdated[key].latest !== dependenciesOutdated[key].current) {
                            helpers.setInArrayByRepoAndKey('npm', 'key', key, 'latest', dependenciesOutdated[key].latest, dependencies);
                        }
                    }
                }
                observer.onNext(dependencies);
                observer.onCompleted();
            })
            .catch(function(err) {
                console.error('NPM support problem', err);
                observer.onCompleted();
            });
    });
}

function updateDependenciesInfo(repo, isDev) {
    return Rx.Observable.create(function(observer) {
        var packageJson = repo === 'bower' ? new PackageJson(null, '/bower.json') : new PackageJson();
        var dependencies = isDev ? packageJson.getDevDependenciesArrayAs(repo) : packageJson.getDependenciesArrayAs(repo);

        //check versions
        if (repo === 'bower') {
            checkVersionBower(dependencies)
                .subscribe(function() {
                    observer.onNext(dependencies);
                    observer.onCompleted();
                });
        } else {
            checkVersionNPM(dependencies)
                .subscribe(function(d) {
                    observer.onNext(dependencies);
                    observer.onCompleted();
                });
        }
    });
}

function updateRepo(repo) {
    return Rx.Observable.create(function(observer) {
        if (!isRepoAvailable[repo]) return observer.onCompleted();

        var sourceRegular = updateDependenciesInfo(repo, false).share();
        var sourceDev = updateDependenciesInfo(repo, true).share();


        var source = sourceRegular.merge(sourceDev);

        sourceRegular
            .subscribe(function(data) {
                modules.all = modules.all.concat(data);
            });

        sourceDev
            .subscribe(function(data) {
                devModules.all = devModules.all.concat(data);
            });

        source
            .subscribe(function() {}, function() {}, function() {
                observer.onCompleted();
            });
    });
}

function updateModulesInfo() {
    checkReposAvailability()
        .subscribe(function() {}, function() {}, function() {
            //repos avaibility completed
            //clear arrays
            modules.all = [];
            devModules.all = [];

            //update all repos
            var sourceNPM = updateRepo('npm');
            var sourceBower = updateRepo('bower');

            sourceNPM
                .merge(sourceBower)
                .subscribe(function() {}, function() {}, function() {
                    console.log('DEPS CHECKED');
                });
        });
}

//just return ready to read list
function getModules(isDev) {
    return isDev ? devModules.all : modules.all;
}
