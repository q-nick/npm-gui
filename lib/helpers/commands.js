'use strict';

var exec = require('child_process').exec;
var Promise = require("bluebird");

var npm = {
    ls: 'npm ls --depth=0 --json',
    lsGlobal: 'npm ls -g --depth=0 --json',
    outdated: 'npm outdated --json',
    outdatedGlobal: 'npm outdated -g --json'
};

var nsp = {
    check: __dirname + '/node_modules/nsp/bin/nsp check --output json'
};

module.exports.npm = npm;
module.exports.nsp = nsp;
module.exports.run = run;

function run(command) {
    return new Promise(function(resolve, reject) {
        exec(command, {
            maxBuffer: 500 * 1024
        }, function(error, stdout, stderr) {
            resolve({
                stdout: stdout,
                stderr: stderr
            });
        });
    });
}
