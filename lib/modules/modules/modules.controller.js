var exec = require('child_process').exec;
var helpers = require('../../helpers/helpers.js');
var PackageJson = require('../../helpers/packageJson.js').PackageJson;
var consoleSocket = require('../console/console.controller.js');

function whenPut(req, res) {
    var saveArg = helpers.isDevModules(req) ? '-D' : '-S';

    consoleSocket.send('start npm install ' + saveArg + ' ' + req.body.key + '\n');

    var output = '';
    var child = exec('npm install ' + saveArg + ' ' + req.body.key,
        function(error, stdout, stderr) {
            output = output + '\n' + stdout + '\n' + stderr;
            if (error !== null) {
                //output = output + error;
            }
        });

    helpers.bindChildStdToConsole(child);

    child.on('close', function() {
        res.status(200).send('<textarea style="width:800px;height:400px;">' + output + '</textarea>');
    });
}

function whenDelete(req, res) {
    var saveArg = helpers.isDevModules(req) ? '-D' : '-S';

    consoleSocket.send('start npm rm ' + saveArg + ' ' + req.params.name + '\n');

    var output = '';
    var child = exec('npm uninstall --save ' + req.params.name,
        function(error, stdout, stderr) {
            output = output + '\n' + stdout + '\n' + stderr;
            if (error !== null) {
                //output = output + error;
            }
            ///bugfix
            var packageJson = new PackageJson();
            if (helpers.isDevModules(req)) {
                packageJson.removeDevDependence(req.params.name);
            } else {
                packageJson.removeDependence(req.params.name);
            }
        });

    helpers.bindChildStdToConsole(child);

    child.on('close', function() {
        res.status(200).send('<textarea style="width:800px;height:400px;">' + output + '</textarea>');
    });
}

function whenGetInstall(req, res) {
    consoleSocket.send('start npm install' + '\n');

    var output = '';
    var child = exec('npm install',
        function(error, stdout, stderr) {
            output = output + '\n' + stdout + '\n' + stderr;
            if (error !== null) {
                //output = output + error;
            }
        });

    helpers.bindChildStdToConsole(child);

    child.on('close', function() {
        res.status(200).send('<textarea style="width:800px;height:400px;">' + output + '</textarea>');
    });
}

function whenGet(req, res) {
    var packageJson = new PackageJson();
    var preparedDependenciesArray = helpers.isDevModules(req) ? packageJson.getDevDependenciesArray() : packageJson.getDependenciesArray();
    res.status(200).send(JSON.stringify(preparedDependenciesArray, null, 2));
}

module.exports.whenGet = whenGet;
module.exports.whenPut = whenPut;
module.exports.whenDelete = whenDelete;
module.exports.whenGetInstall = whenGetInstall;