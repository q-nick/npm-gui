'use strict';
//

var exec = require('child_process').exec;
var spawn = require('cross-spawn');
var Promise = require('bluebird');
//
var consoleSocket = require('../modules/console/console.controller.js');

var npm = {
    ls: {
        command: 'npm',
        args: ['ls', '--depth=0', '--json'],
    },
    outdated: {
        command: 'npm',
        args: ['outdated', '--json']
    },
    install: {
        command: 'npm',
        args: ['install']
    },
    uninstall: {
        command: 'npm',
        args: ['uninstall']
    },
    run: {
        command: 'npm',
        args: ['run']
    },
    bin: {
        command: 'npm',
        args: ['bin']
    }
};

var nsp = {
    check: {
        command: __dirname + '/node_modules/nsp/bin/nsp',
        args: ['check', '--output', 'json']
    }
};

module.exports.npm = npm;
module.exports.nsp = nsp;
module.exports.run = run;

function run(command, bindConsole) {
    return new Promise(function(resolve, reject) {
        //send init message
        if (bindConsole) {
            consoleSocket.send('start: ' + command.command + ' ' + command.args.toString() + '\n');
        }
        //spawn process
        var spawned = spawn(command.command, command.args);

        //wait for stdout, stderr
        var stdout = '';
        spawned.stdout.on('data', function(data) {
            stdout += data.toString();
            //send part data through socket if required
            //TODO send as stdout
            if (bindConsole) {
                consoleSocket.send(data.toString());
            }
        });

        var stderr = '';
        spawned.stderr.on('data', function(data) {
            stderr += data;
            //TODO send as stderr and show red color
            if (bindConsole) {
                consoleSocket.send(data.toString());
            }
        });

        //wait for finish and resolve
        spawned.on('close', function(code) {
            resolve({
                stdout: stdout,
                stderr: stderr
            });
        });
    });
}
