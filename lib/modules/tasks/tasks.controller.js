var exec = require('child_process').exec;
var helpers = require('../../helpers/helpers.js');
var PackageJson = require('../../helpers/packageJson.js').PackageJson;
var consoleSocket = require('../console/console.controller.js');

function whenGet(req, res) {
    var packageJson = new PackageJson();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(packageJson.getTasksArray(), null, 2));
}

function whenPut(req, res) {
    var packageJson = new PackageJson();
    packageJson.addTask(req.body.key, req.body.value);
    res.status(200).send('<textarea style="width:800px;height:400px;">' + JSON.stringify(packageJson.getTasks(), null, 2) + '</textarea>');
}

function whenDelete(req, res) {
    var packageJson = new PackageJson();
    packageJson.removeTask(req.params.name);
    res.status(200).send('<textarea style="width:800px;height:400px;">' + JSON.stringify(packageJson.getTasks(), null, 2) + '</textarea>');
}

function whenPost(req, res) {
    consoleSocket.send('npm run ' + req.params.name + '\n');
    var output = '';
    var child = exec('npm run ' + req.params.name,
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

function whenGetHelp(req, res) {
    var localPath = './node_modules/' + req.params.name;
    var packageJson = new PackageJson(localPath + '/package.json');

    if (packageJson.getBin()) {
        var output = '';
        var child = exec('node ' + localPath + '/' + packageJson.getBin() + ' --help',
            function(error, stdout, stderr) {
                output = output + '\n' + stdout + '\n' + stderr;
                if (error !== null) {
                    //output = output + error;
                }
            });

        child.on('close', function() {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send({text: output, flags: output.match(/[\-]{1,2}[a-zA-Z0-9]+/g)});
        });
    } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send({text: 'No info for that package :(', flags: []});
    }

}

module.exports.whenGet = whenGet;
module.exports.whenPut = whenPut;
module.exports.whenDelete = whenDelete;
module.exports.whenPost = whenPost;

module.exports.whenGetHelp = whenGetHelp;