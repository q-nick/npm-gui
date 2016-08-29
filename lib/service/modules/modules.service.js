'use strict';

module.exports.getModules = getModules;
module.exports.updateAllModules = updateAllModules;
module.exports.updateModulesInfo = updateModulesInfo;
module.exports.prune = prune;
module.exports.dedupe = dedupe;

/////////////////////

var Rx = require('rx');
var PackageJson = require('../../model/package-json.js').PackageJson;
var CommandsService = require('../../service/commands/commands.service.js');
var UtilsService = require('../../service/utils/utils.service.js');
var ProjectService = require('../../service/project/project.service.js');

/////////////////////
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

function checkReposAvailability() {
    return Rx.Observable.create(function(observer) {
        var sourceBower = ProjectService.isBowerAvailable();
        sourceBower
            .subscribe(function() {
                isRepoAvailable.bower = true;
            }, function() {
                isRepoAvailable.bower = false;
            })

        var sourceNPM = ProjectService.isNPMAvailable();
        sourceNPM
            .subscribe(function() {
                isRepoAvailable.npm = true;
            }, function() {
                isRepoAvailable.npm = false;
            });

        var source = sourceBower.merge(sourceNPM);

        source.subscribeOnCompleted(function() {
            observer.onNext();
            observer.onCompleted();
        });
    });
}

function checkVersionBower(dependencies) {
    return Rx.Observable.create(function(observer) {
        CommandsService.run(CommandsService.cmd.bower.ls)
            .subscribe(function(data) {
                var dependenciesListed = UtilsService.JSONparse(data.stdout).dependencies;
                for (var key in dependenciesListed) {
                    if (dependenciesListed.hasOwnProperty(key) && dependenciesListed[key].pkgMeta) {
                        UtilsService.setInArrayByRepoAndKey('bower', 'key', key, 'version', dependenciesListed[key].pkgMeta.version, dependencies);

                        if (dependenciesListed[key].update.target !== dependenciesListed[key].pkgMeta.version) {
                            UtilsService.setInArrayByRepoAndKey('bower', 'key', key, 'wanted', dependenciesListed[key].update.target, dependencies);
                        }
                        if (dependenciesListed[key].update.latest !== dependenciesListed[key].pkgMeta.version) {
                            UtilsService.setInArrayByRepoAndKey('bower', 'key', key, 'latest', dependenciesListed[key].update.latest, dependencies);
                        }
                    }
                }
                observer.onNext(dependencies);
                observer.onCompleted();
            });
    });
}

function checkVersionNPM(dependencies) {
    return Rx.Observable.create(function(observer) {
        var lsSource = CommandsService.run(CommandsService.cmd.npm.ls).share();
        var outdatedSource = CommandsService.run(CommandsService.cmd.npm.outdated).share();

        var bothSource = Rx.Observable.concat(lsSource, outdatedSource);

        lsSource
            .subscribe(function(data) {
                //ls command result
                var dependenciesListed = UtilsService.JSONparse(data.stdout).dependencies;
                for (var key in dependenciesListed) {
                    if (dependenciesListed.hasOwnProperty(key)) {
                        UtilsService.setInArrayByRepoAndKey('npm', 'key', key, 'version', dependenciesListed[key].version, dependencies);
                    }
                }
            });

        bothSource
            .subscribeOnCompleted(function() {
                observer.onNext(dependencies);
                observer.onCompleted();
            });

        outdatedSource
            .subscribe(function(data) {
                //outdated command result
                var dependenciesOutdated = UtilsService.JSONparse(data.stdout);
                for (var key in dependenciesOutdated) {
                    if (dependenciesOutdated.hasOwnProperty(key)) {
                        if (dependenciesOutdated[key].wanted !== dependenciesOutdated[key].current) {
                            UtilsService.setInArrayByRepoAndKey('npm', 'key', key, 'wanted', dependenciesOutdated[key].wanted, dependencies);
                        }
                        if (dependenciesOutdated[key].latest !== dependenciesOutdated[key].current) {
                            UtilsService.setInArrayByRepoAndKey('npm', 'key', key, 'latest', dependenciesOutdated[key].latest, dependencies);
                        }
                    }
                }
            });
    });
}

function updateDependenciesInfo(repo, isDev) {
    return Rx.Observable.create(function(observer) {
        var packageJson = (repo === 'bower') ? ProjectService.getBowerJson() : ProjectService.getPackageJson();
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
        if (!isRepoAvailable[repo]) {
            observer.onNext()
            observer.onCompleted();
            return;
        }

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
            .subscribeOnCompleted(function() {
                observer.onNext();
                observer.onCompleted();
            });
    });
}

function updateAllModulesForRepo(isDev, type, repo) {
    return Rx.Observable.create(function(observer) {
        //if repo unavailable complete subscription
        if (!isRepoAvailable[repo]) {
            observer.onNext()
            observer.onCompleted();
            return;
        }

        //replace version name for wanted
        if (repo === 'bower' && type === 'wanted') {
            type = 'target'
        }

        //get packageJson or bowerJson
        var packageJson = (repo === 'npm') ? ProjectService.getPackageJson() : ProjectService.getBowerJson();

        //get .json versions
        var depsInPackageJson = isDev ? packageJson.getDevDependencies() : packageJson.getDependencies();
        //get current updated versions
        var versions = isDev ? devModules.all : modules.all;

        //iterate over repos dependencies
        for (var key in depsInPackageJson) {
            if (depsInPackageJson.hasOwnProperty(key)) {
                //find module in our array
                var moduleVersions = UtilsService.findInArrayByRepoAndKey(repo, 'key', key, versions);

                //update base version (required always if is another)
                if (moduleVersions && depsInPackageJson[key].slice(1) !== moduleVersions.version) {
                    depsInPackageJson[key] = depsInPackageJson[key].replace(/[.\d]+/g, moduleVersions.version);
                }
                //update to requested type version
                if (moduleVersions && moduleVersions[type]) {
                    depsInPackageJson[key] = depsInPackageJson[key].replace(/[.\d]+/g, moduleVersions[type]);
                }
            }
        }

        //save file
        packageJson.save();
        console.log(repo + ' saved');

        //run install command
        CommandsService
            .run(CommandsService.cmd[repo].update)
            .subscribe(function() {
                observer.onNext()
                observer.onCompleted();
            });
    });
}


function updateModulesInfo() {
    return Rx.Observable.create(function(observer) {
        checkReposAvailability()
            .subscribe(function() {
                //repos avaibility completed
                //clear arrays
                modules.all = [];
                devModules.all = [];
                //update all repos
                var sourceNPM = updateRepo('npm');
                var sourceBower = updateRepo('bower');

                var sourceBoth = sourceNPM.merge(sourceBower)

                sourceBoth
                    .subscribeOnCompleted(function() {
                        modules.lastId = true;
                        devModules.lastId = true;
                        observer.onNext();
                        observer.onCompleted();
                    });
            });
    });
}

function pruneModules(repo) {
    return Rx.Observable.create(function(observer) {
        if (!isRepoAvailable[repo]) {
            observer.onNext()
            observer.onCompleted();
            return;
        }

        CommandsService
            .run(CommandsService.cmd[repo].prune, true)
            .subscribe(function() {
                observer.onNext()
                observer.onCompleted();
            });
    });
}

function shrinkwrapModules(repo) {
    return Rx.Observable.create(function(observer) {
        if (!isRepoAvailable[repo]) {
            observer.onNext()
            observer.onCompleted();
            return;
        }

        CommandsService
            .run(CommandsService.cmd[repo].shrinkwrap, true)
            .subscribe(function() {
                observer.onNext()
                observer.onCompleted();
            });
    });
}
/////////////////////////////////////////////////////////////////////////////////

function getModules(isDev) {
    return Rx.Observable.create(function(observer) {
        if (modules.lastId && devModules.lastId) {
            observer.onNext(isDev ? devModules.all : modules.all);
            observer.onCompleted();
        } else {
            updateModulesInfo()
                .subscribe(function() {
                    observer.onNext(isDev ? devModules.all : modules.all);
                    observer.onCompleted();
                });
        }
    });
}


function updateAllModules(isDev, type) {
    return Rx.Observable.create(function(observer) {
        //force check versions
        modules.lastId = null;
        devModules.lastId = null;

        updateModulesInfo()
            .subscribe(function() {
                var npmUpdateSource = updateAllModulesForRepo(isDev, type, 'npm');
                var bowerUpdateSource = updateAllModulesForRepo(isDev, type, 'bower');

                var bothSource = Rx.Observable.concat(npmUpdateSource, bowerUpdateSource);

                bothSource
                    .subscribeOnCompleted(function() {
                        observer.onNext(isDev ? devModules.all : modules.all);
                        observer.onCompleted();
                    });
            });
    });
}

function prune() {
    return Rx.Observable.create(function(observer) {
        var npmPruneSource = pruneModules('npm');
        var bowerPruneSource = pruneModules('bower');

        var bothSource = Rx.Observable.concat(npmPruneSource, bowerPruneSource);

        bothSource
            .subscribeOnCompleted(function() {
                observer.onNext();
                observer.onCompleted();
            });
    });
}

function dedupe(repo) {
    return Rx.Observable.create(function(observer) {
        if (!isRepoAvailable['npm']) {
            observer.onNext()
            observer.onCompleted();
            return;
        }

        CommandsService
            .run(CommandsService.cmd.npm.dedupe, true)
            .subscribe(function() {
                observer.onNext()
                observer.onCompleted();
            });
    });
}

function shrinkwrap() {
    return Rx.Observable.create(function(observer) {
        var npmShrinkwrapSource = shrinkwrapModules('npm');
        var bowerShrinkwrapSource = shrinkwrapModules('bower');

        var bothSource = Rx.Observable.concat(npmShrinkwrapSource, bowerShrinkwrapSource);

        bothSource
            .subscribeOnCompleted(function() {
                observer.onNext();
                observer.onCompleted();
            });
    });
}
