import Rx from 'rx';
import CommandsService from '../../service/commands/commands.service.js';
import ProjectService from '../../service/project/project.service.js';

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

function prune() {
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
}

export default {
  prune,
  pruneCount: prune,
};
