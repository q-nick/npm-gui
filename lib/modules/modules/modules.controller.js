'use strict';

module.exports.whenGet = whenGet;
module.exports.whenGetNSP = whenGetNSP;
module.exports.whenPut = whenPut;
module.exports.whenDelete = whenDelete;
module.exports.whenGetInstall = whenGetInstall;
module.exports.whenPostUpdateAll = whenPostUpdateAll;
module.exports.whenGetPrune = whenGetPrune;
module.exports.whenGetDedupe = whenGetDedupe;

var fs = require('fs');

var UtilsService = require('../../service/utils/utils.service.js');
var CommandsService = require('../../service/commands/commands.service.js');
var PackageJson = require('../../model/package-json.js').PackageJson;
var ModulesService = require('../../service/modules/modules.service.js');

function whenPut(req, res) {
    var putCommand = JSON.parse(JSON.stringify(CommandsService.cmd[req.params.repo].install));
    putCommand.args.push(req.body.key + (req.body.value ? '@' + req.body.value : ''));
    putCommand.args.push(UtilsService.isDevModules(req) ? '-D' : '-S');

    CommandsService
        .run(putCommand, true)
        .subscribe(function(data) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send();
        });
}

function whenDelete(req, res) {
    var uninstallCommand = JSON.parse(JSON.stringify(CommandsService.cmd[req.params.repo].uninstall));
    uninstallCommand.args.push(req.params.name);
    uninstallCommand.args.push(UtilsService.isDevModules(req) ? '-D' : '-S');

    CommandsService
        .run(uninstallCommand, true)
        .then(function(data) {
            ///bugfix
            //TODO tests
            var packageJson = new PackageJson();
            if (UtilsService.isDevModules(req)) {
                packageJson.removeDevDependence(req.params.name);
            } else {
                packageJson.removeDependence(req.params.name);
            }

            res.setHeader('Content-Type', 'application/json');
            res.status(200).send();
        });
}

//TODO: button and tests
function whenGetInstall(req, res) {
    CommandsService
        .run(CommandsService.cmd.npm.install, true)
        .then(function(data) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send();
        });
}

function whenGet(req, res) {
    var isDev = UtilsService.isDevModules(req);

    ModulesService
        .getModules(isDev)
        .subscribe(function(dependencies) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(dependencies);
        });
}

function whenGetNSP(req, res) {
    CommandsService
        .run(CommandsService.cmd.nsp.check)
        .subscribe(function(data) {
            var dependencies = {};
            if (data.stderr) {
                UtilsService.buildObjectFromArray(UtilsService.JSONparse(data.stderr), dependencies, 'module');
            }
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(dependencies);
        });
}

function whenGetPrune(req, res) {
    ModulesService
        .prune()
        .subscribe(function() {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send({});
        });
}

function whenGetDedupe(req, res) {
    ModulesService
        .dedupe()
        .subscribe(function() {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send({});
        });
}

function whenPostUpdateAll(req, res) {
    var type = req.body.type;
    var isDev = UtilsService.isDevModules(req);

    ModulesService
        .updateAllModules(isDev, type)
        .subscribe(function(dependencies) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(dependencies);
        });
}
