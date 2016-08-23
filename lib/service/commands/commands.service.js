'use strict';

module.exports.run = run;
module.exports.cmd = require('./commands.constants.js');

/////////////////////

var Rx = require('rx');
var exec = require('child_process').exec;
var spawn = require('cross-spawn');
//
var ProjectService = require('../project/project.service.js');
var ConsoleService = require('../console/console.service.js');

/////////////////////

function run(command, bindConsole) {
    return Rx.Observable.create(function(observer) {
        //send init message
        if (bindConsole) {
            ConsoleService.send('start: ' + command.command + ' ' + command.args.toString() + '\n');
        }

        //spawn process
        var spawned = spawn(command.command, command.args, {
            cwd: ProjectService.getPath()
        });

        //wait for stdout, stderr
        var stdout = '';
        spawned.stdout.on('data', function(data) {
            stdout += data.toString();
            //send part data through socket if required
            //TODO send as stdout
            if (bindConsole) {
                ConsoleService.send(data.toString());
            }
        });

        var stderr = '';
        spawned.stderr.on('data', function(data) {
            stderr += data;
            //TODO send as stderr and show red color
            if (bindConsole) {
                ConsoleService.send(data.toString());
            }
        });

        //wait for finish and resolve
        spawned.on('close', function(code) {
            observer.onNext({
                stdout: stdout,
                stderr: stderr
            });
            observer.onCompleted();
        });
    });
}
