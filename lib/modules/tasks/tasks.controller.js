'use strict';

module.exports.whenGet = whenGet;
module.exports.whenPut = whenPut;
module.exports.whenDelete = whenDelete;
module.exports.whenPost = whenPost;

module.exports.whenGetHelp = whenGetHelp;


var exec = require('child_process').exec;
var helpers = require('../../helpers/helpers.js');
var PackageJson = require('../../helpers/packageJson.js').PackageJson;
var consoleSocket = require('../console/console.controller.js');
var commands = require('../../helpers/commands.js');

function whenGet(req, res) {
    var packageJson = new PackageJson();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(packageJson.getTasksArray());
}

function whenPut(req, res) {
    var packageJson = new PackageJson();
    packageJson.addTask(req.body.key, req.body.value);
    res.status(200).send();
}

function whenDelete(req, res) {
    var packageJson = new PackageJson();
    packageJson.removeTask(req.params.name);
    res.status(200).send();
}

function whenPost(req, res) {
    var runCommand = JSON.parse(JSON.stringify(commands.npm.run));
    runCommand.args.push(req.params.name);

    commands
        .run(runCommand, true)
        .then(function(data) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send();
        });
}

function whenGetHelp(req, res) {
    commands
        .run(commands.npm.bin)
        .then(function(data) {
            return commands
                .run({
                    command: 'node',
                    args: [data.stdout.replace('\n', '') + '/' + req.params.name, '--help']
                })
        })
        .then(function(data) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send({
                text: (data.stdout + data.stderr),
                flags: (data.stdout + data.stderr).match(/[\-]{1,2}[a-zA-Z0-9]+/g)
            });
        });
}
