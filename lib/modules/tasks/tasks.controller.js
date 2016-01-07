var exec = require('child_process').exec;
var fs = require('fs');
var helpers = require('../../helpers/helpers.js');
var consoleSocket = require('../console/console.controller.js');

function whenGet(req, res) {
    var packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    var arrayOfTasks = [];
    helpers.buildArrayFromObject(packageJson.scripts, arrayOfTasks, 'key', 'value');

    res.status(200).send(JSON.stringify(arrayOfTasks, null, 2));
}

function whenPut(req, res) {
    var packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    packageJson.scripts[req.body.key] = req.body.value;
    fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
    res.status(200).send('<textarea style="width:800px;height:400px;">' + JSON.stringify(packageJson.scripts, null, 2) + '</textarea>');
}

function whenDelete(req, res) {
    var packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    delete packageJson.scripts[req.params.name];
    fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
    res.status(200).send('<textarea style="width:800px;height:400px;">' + JSON.stringify(packageJson.scripts, null, 2) + '</textarea>');
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

module.exports.whenGet = whenGet;
module.exports.whenPut = whenPut;
module.exports.whenDelete = whenDelete;
module.exports.whenPost = whenPost;