const Rx = require('rx');
const CommandsService = require('../../service/commands/commands.service.js');
const ProjectService = require('../../service/project/project.service.js');

module.exports.dedupe = function dedupe() {
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
};
