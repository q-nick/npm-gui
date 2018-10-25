import Rx from 'rx';
import CommandsService from '../../service/commands/commands.service.js';
import ProjectService from '../../service/project/project.service.js';

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

function shrinkwrap() {
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

export default {
  shrinkwrap,
};
