'use strict';

module.exports.whenGet = whenGet;
module.exports.whenGetVersions = whenGetVersions;
module.exports.whenGetNSP = whenGetNSP;
module.exports.whenPut = whenPut;
module.exports.whenDelete = whenDelete;


var UtilsService = require('../../service/utils/utils.service.js');
var CommandsService = require('../../service/commands/commands.service.js');

function whenPut(req, res) {
    var putCommand = JSON.parse(JSON.stringify(commands.npm.install));
    putCommand.args.push(req.body.key + (req.body.value ? '@' + req.body.value : ''));
    putCommand.args.push('-g');

    CommandsService
        .run(putCommand, true)
        .then(function(data) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send();
        });
}

function whenDelete(req, res) {
    var uninstallCommand = JSON.parse(JSON.stringify(commands.npm.uninstall));
    uninstallCommand.args.push(req.params.name);
    uninstallCommand.args.push('-g');

    CommandsService
        .run(uninstallCommand, true)
        .then(function(data) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send();
        });
}

function whenGet(req, res) {
    var lsCommand = JSON.parse(JSON.stringify(commands.npm.ls));
    lsCommand.args.push('-g');

    CommandsService
        .run(lsCommand)
        .then(function(data) {
            var dependencies = UtilsService.JSONparse(data.stdout).dependencies;
            var preparedDependenciesArray = [];
            UtilsService.buildArrayFromObject(dependencies, preparedDependenciesArray, 'key', 'value');
            for (var i = 0; i < preparedDependenciesArray.length; i++) {
                preparedDependenciesArray[i].value = preparedDependenciesArray[i].value.version;
            }

            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(preparedDependenciesArray);
        });
}

function whenGetVersions(req, res) {
    var dependencies = null;
    //
    var lsCommand = JSON.parse(JSON.stringify(commands.npm.ls));
    lsCommand.args.push('-g');
    var outdatedCommand = JSON.parse(JSON.stringify(commands.npm.outdated));
    outdatedCommand.args.push('-g');

    CommandsService
        .run(lsCommand)
        .then(function(data) {
            dependencies = UtilsService.JSONparse(data.stdout).dependencies;
            return commands
                .run(outdatedCommand);
        })
        .then(function(data) {
            var outdated = UtilsService.JSONparse(data.stdout);
            for (var key in outdated) {
                if (outdated.hasOwnProperty(key)) {
                    if (outdated[key].wanted !== outdated[key].current) {
                        dependencies[key].wanted = outdated[key].wanted;
                    }
                    dependencies[key].latest = outdated[key].latest;
                }
            }
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(dependencies);
        });
}

function whenGetNSP(req, res) {
    //TODO?
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send({});
}
