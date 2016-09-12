const Rx = require('rx');
const CommandsService = require('../../service/commands/commands.service.js');
const ProjectService = require('../../service/project/project.service.js');

function shrinkwrapModules(repo) {
  return Rx.Observable.create((observer) => {
    if (!ProjectService.isRepoAvailable[repo]) {
      observer.onNext();
      observer.onCompleted();
      return;
    }

    CommandsService
      .run(CommandsService.cmd[repo].shrinkwrap, true)
      .subscribe(() => {
        observer.onNext();
        observer.onCompleted();
      });
  });
}

module.exports.shrinkwrap = function shrinkwrap() {
  return Rx.Observable.create((observer) => {
    const npmShrinkwrapSource = shrinkwrapModules('npm');
    const bowerShrinkwrapSource = shrinkwrapModules('bower');

    const bothSource = Rx.Observable.concat(npmShrinkwrapSource, bowerShrinkwrapSource);

    bothSource
      .subscribeOnCompleted(() => {
        observer.onNext();
        observer.onCompleted();
      });
  });
}
