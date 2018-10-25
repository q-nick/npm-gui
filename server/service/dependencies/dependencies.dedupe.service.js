import Rx from 'rx';
import CommandsService from '../../service/commands/commands.service.js';
import ProjectService from '../../service/project/project.service.js';

function dedupe() {
  return Rx.Observable.create((observer) => {
    if (!ProjectService.isRepoAvailable('npm')) {
      observer.onNext();
      observer.onCompleted();
      return;
    }

    // it return nothing - just bind console
    CommandsService
      .run(CommandsService.cmd.npm.dedupe, true)
      .subscribe(() => {
        observer.onNext();
        observer.onCompleted();
      });
  });
}

export default {
  dedupe,
};
