const Rx = require('rx');
const ProjectService = require('../../service/project/project.service.js');
const CommandsService = require('../../service/commands/commands.service.js');
const rimraf = require('rimraf');

function reinstallAllDependenciesForRepo(repo) {
  return Rx.Observable.create(function (observer) {
    // if repo unavailable complete subscription
    if (!ProjectService.isRepoAvailable[repo]) {
      observer.onNext();
      observer.onCompleted();
      return;
    }

    // this should be taken from ProjectService
    const rm = Rx.Observable.fromCallback(rimraf);
    const folder = (repo === 'bower') ? 'bower_components' : 'node_modules';
    const removeFolderSource = rm(`${ProjectService.getPath()}/${folder}`);

    removeFolderSource
      .subscribe(() => {
        CommandsService
          .run(CommandsService.cmd[repo].install, true)
          .subscribe(() => {
            observer.onNext();
            observer.onCompleted();
          });
      });
  });
}

module.exports.reinstallAllDependencies = function reinstallAllDependencies() {
  // force check versions
  this.modules.lastId = null;
  this.devModules.lastId = null;

  return Rx.Observable.create((observer) => {
    const npmReinstallSource = reinstallAllDependenciesForRepo('npm');
    const bowerReinstallSource = reinstallAllDependenciesForRepo('bower');

    const bothSource = Rx.Observable.concat(npmReinstallSource, bowerReinstallSource);

    bothSource
      .subscribeOnCompleted(() => {
        observer.onNext(/*isDev ? devModules.all : modules.all*/);
        observer.onCompleted();
      });
  });
};
