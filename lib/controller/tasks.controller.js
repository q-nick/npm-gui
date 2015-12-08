var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;
var fs = require('fs');
var helpers = require('../helpers/helpers.js');
var consoleSocket = require('./console.controller.js');

router.get('/', function(req, res) {
    var packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    var arrayOfTasks = [];
    helpers.buildArrayFromObject(packageJson.scripts, arrayOfTasks, 'key', 'value');

    res.status(200).send(JSON.stringify(arrayOfTasks, null, 2));
});

router.put('/', function(req, res) {
    var packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    packageJson.scripts[req.body.key] = req.body.value;
    fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
    res.status(200).send('<textarea style="width:800px;height:400px;">' + JSON.stringify(packageJson.scripts, null, 2) + '</textarea>');
});

router.delete('/:name', function(req, res) {
    var packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    delete packageJson.scripts[req.params.name];
    fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
    res.status(200).send('<textarea style="width:800px;height:400px;">' + JSON.stringify(packageJson.scripts, null, 2) + '</textarea>');
});

router.post('/:name', function(req, res) {
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
});

module.exports = router;