const Rx = require('rx');
const spawn = require('cross-spawn');
const cmd = require('./commands.constants.js');
//
const ProjectService = require('../project/project.service.js');
const ConsoleService = require('../console/console.service.js');

module.exports = {
  cmd,
  run(command, bindConsole = false, additionalArgs = []) {
    return Rx.Observable.create((observer) => {
      // make a deep copy
      const commandToSpawn = JSON.parse(JSON.stringify(command));

      // add additional args
      commandToSpawn.args = commandToSpawn.args.concat(additionalArgs);

      // send init message
      if (bindConsole) {
        ConsoleService.send(`start: ${commandToSpawn.command} ${commandToSpawn.args.toString()}\n`);
      }

      // spawn process
      const spawned = spawn(commandToSpawn.command, commandToSpawn.args, {
        cwd: ProjectService.getPath(),
      });

      // wait for stdout, stderr
      let stdout = '';
      spawned.stdout.on('data', (data) => {
        stdout += data.toString();
        // send part data through socket if required
        // TODO send as stdout
        if (bindConsole) {
          ConsoleService.send(data.toString());
        }
      });

      let stderr = '';
      spawned.stderr.on('data', (data) => {
        stderr += data;
        // TODO send as stderr and show red color
        if (bindConsole) {
          ConsoleService.send(data.toString());
        }
      });

      // wait for finish and resolve
      spawned.on('close', () => {
        observer.onNext({
          stdout,
          stderr,
        });
        observer.onCompleted();
      });
    });
  },
};
