const Rx = require('rx');
const ProjectService = require('../../service/project/project.service');
const CommandsService = require('../../service/commands/commands.service');
const UtilsService = require('../../service/utils/utils.service');

function updateAllModulesForRepo(isDev, type, repo) {
  return Rx.Observable.create((observer) => {
    // if repo unavailable complete subscription
    if (!ProjectService.isRepoAvailable[repo]) {
      observer.onNext();
      observer.onCompleted();
      return;
    }

    // replace version name for wanted
    if (repo === 'bower' && type === 'wanted') {
      type = 'target';
    }

    // get packageJson or bowerJson
    const packageJson = (repo === 'npm') ?
      ProjectService.getPackageJson()
      :
      ProjectService.getBowerJson();

    // get .json versions
    const depsInPackageJson = isDev ?
      packageJson.getDevDependencies()
      :
      packageJson.getDependencies();
    // get current updated versions
    const versions = isDev ? devModules.all : modules.all;

    // iterate over repos dependencies
    for (const [key, dependency] of depsInPackageJson) {
      // find module in our array
      const moduleVersions = UtilsService.findInArrayByRepoAndKey(repo, 'key', key, versions);

      // update base version (required always if is another)
      if (moduleVersions && dependency.slice(1) !== moduleVersions.version) {
        depsInPackageJson[key] = dependency.replace(/[.\d]+/g, moduleVersions.version);
      }
      // update to requested type version
      if (moduleVersions && moduleVersions[type]) {
        depsInPackageJson[key] = dependency.replace(/[.\d]+/g, moduleVersions[type]);
      }
    }

    // save file
    packageJson.save();
    console.log(repo, ' saved');

    // run install command
    CommandsService
      .run(CommandsService.cmd[repo].update)
      .subscribe(() => {
        observer.onNext();
        observer.onCompleted();
      });
  });
}


module.exports = function updateAllModules(isDev, type) {
  return Rx.Observable.create((observer) => {
    //  updateModulesInfo() we will not update modules again
    //    .subscribe(function () {
    const npmUpdateSource = updateAllModulesForRepo(isDev, type, 'npm');
    const bowerUpdateSource = updateAllModulesForRepo(isDev, type, 'bower');

    const bothSource = Rx.Observable.concat(npmUpdateSource, bowerUpdateSource);

    bothSource
      .subscribeOnCompleted(()=> {
        observer.onNext(isDev ? devModules.all : modules.all);
        observer.onCompleted();
      });
    //   });
  });
}

module.exports = updateAllModules;
