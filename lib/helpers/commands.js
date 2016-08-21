'use strict';
//

var exec = require('child_process').exec;
var spawn = require('cross-spawn');
var Promise = require('bluebird');
//
var helpers = require('./helpers.js');
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
    },
    prune: {
        command: 'npm',
        args: ['prune']
    },
    update: {
        command: 'npm',
        args: ['update']
    }
};

var nsp = {
    check: {
        command: __dirname + '/node_modules/nsp/bin/nsp',
        args: ['check', '--output', 'json']
    }
};

var bower = {
    install: {
        command: 'bower',
        args: ['install']
    },
    uninstall: {
        command: 'bower',
        args: ['uninstall']
    },
    ls: {
        command: 'bower',
        args: ['ls', '--depth=0', '--json'],
    },
    prune: {
        command: 'bower',
        args: ['prune'],
    },
}

module.exports.npm = npm;
module.exports.nsp = nsp;
module.exports.run = run;
module.exports.bower = bower;

function run(command, bindConsole) {
    return new Promise(function(resolve, reject) {
        //send init message
        if (bindConsole) {
            consoleSocket.send('start: ' + command.command + ' ' + command.args.toString() + '\n');
        }
        //spawn process
        var spawned = spawn(command.command, command.args, {
            cwd: helpers.getProjectPath()
        });

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
