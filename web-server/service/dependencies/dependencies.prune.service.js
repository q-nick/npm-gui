const Rx = require('rx');
const CommandsService = require('../../service/commands/commands.service.js');
const ProjectService = require('../../service/project/project.service.js');

function pruneModules(repo) {
  return Rx.Observable.create((observer) => {
    if (!ProjectService.isRepoAvailable(repo)) {
      observer.onNext();
      observer.onCompleted();
      return;
    }

    CommandsService
      .run(CommandsService.cmd[repo].prune, true)
      .subscribe(() => {
        observer.onNext();
        observer.onCompleted();
      });
  });
}

module.exports.prune = function prune() {
  return Rx.Observable.create((observer) => {
    const npmPruneSource = pruneModules('npm');
    const bowerPruneSource = pruneModules('bower');

    const bothSource = Rx.Observable.concat(npmPruneSource, bowerPruneSource);

    bothSource
      .subscribeOnCompleted(() => {
        observer.onNext();
        observer.onCompleted();
      });
  });
};


module.exports.pruneCount = function prune() {
  return Rx.Observable.create((observer) => {
    // TODO
  });
};
