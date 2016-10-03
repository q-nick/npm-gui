const Rx = require('rx');
const ProjectService = require('../../service/project/project.service');
const CommandsService = require('../../service/commands/commands.service');
const UtilsService = require('../../service/utils/utils.service');

function updateAllDependenciesForRepo(isDev, type, repo) {
  return Rx.Observable.create((observer) => {
    // if repo unavailable complete subscription
    if (!ProjectService.isRepoAvailable(repo)) {
      observer.onNext();
      observer.onCompleted();
      return;
    }

    // replace version name for wanted
    if (repo === 'bower' && type === 'wanted') {
      type = 'target';
    }

    // get packageJson or bowerJson
    const packageJson = ProjectService.getPackageJson(repo);

    // get .json versions
    const depsInPackageJson = isDev ?
      packageJson.getDevDependencies()
      :
      packageJson.getDependencies();
    // get current updated versions
    const versions = isDev ?
      ProjectService.devDependencies.all : ProjectService.dependencies.all;

    // iterate over repos dependencies
    Object.keys(depsInPackageJson).forEach((key) => {
      const dependency = depsInPackageJson[key];
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
    });

    // save file
    packageJson.save();
    console.log(repo, ' saved');

    // run install command
    CommandsService
      .run(CommandsService.cmd[repo].update, true)
      .subscribe(() => {
        observer.onNext();
        observer.onCompleted();
      });
  });
}


module.exports.updateAllDependencies = function updateAllDependencies(isDev, type) {
  return Rx.Observable.create((observer) => {
    //  updateModulesInfo() we will not update modules again
    //    .subscribe(function () {
    const npmUpdateSource = updateAllDependenciesForRepo(isDev, type, 'npm');
    const bowerUpdateSource = updateAllDependenciesForRepo(isDev, type, 'bower');

    const bothSource = Rx.Observable.concat(npmUpdateSource, bowerUpdateSource);

    bothSource
      .subscribeOnCompleted(() => {
        observer.onNext(isDev ?
          ProjectService.devDependencies.all : ProjectService.dependencies.all);
        observer.onCompleted();
      });
  });
};
