var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;
var fs = require('fs');
var helpers = require('../helpers/helpers.js');
var consoleSocket = require('./console.controller.js');

router.put('/', function(req, res) {
    consoleSocket.send('start npm install --save-dev ' + req.body.key + '\n');

    var output = '';
    var child = exec('npm install --save-dev ' + req.body.key,
        function(error, stdout, stderr) {
            output = output + '\n' + stdout + '\n' + stderr;
            if (error !== null) {
                //output = output + error;
            }
        });

    child.stdout.on('data', function(data) {
        consoleSocket.send(data.toString());
    });

    child.stderr.on('data', function(data) {
        consoleSocket.send(data.toString());
    });

    child.stdin.on('data', function(data) {
        consoleSocket.send(data.toString());
    });

    child.on('close', function() {
        res.status(200).send('<textarea style="width:800px;height:400px;">' + output + '</textarea>');
    });
});

router.delete('/:name', function(req, res) {
    consoleSocket.send('start npm uninstall --save-dev ' + req.body.name + '\n');

    var output = '';
    var child = exec('npm uninstall --save-dev ' + req.params.name,
        function(error, stdout, stderr) {
            output = output + '\n' + stdout + '\n' + stderr;
            if (error !== null) {
                //output = output + error;
            }
        });

    child.stdout.on('data', function(data) {
        consoleSocket.send(data.toString());
    });

    child.stderr.on('data', function(data) {
        consoleSocket.send(data.toString());
    });

    child.stdin.on('data', function(data) {
        consoleSocket.send(data.toString());
    });

    child.on('close', function() {
        res.status(200).send('<textarea style="width:800px;height:400px;">' + output + '</textarea>');
    });
});

router.get('/install', function(req, res) {
    consoleSocket.send('start npm install' + '\n');
    var output = '';
    var child = exec('npm install',
        function(error, stdout, stderr) {
            output = output + '\n' + stdout + '\n' + stderr;
            if (error !== null) {
                //output = output + error;
            }
        });

    child.stdout.on('data', function(data) {
        consoleSocket.send(data.toString());
    });

    child.stderr.on('data', function(data) {
        consoleSocket.send(data.toString());
    });

    child.stdin.on('data', function(data) {
        consoleSocket.send(data.toString());
    });

    child.on('close', function() {
        res.status(200).send('<textarea style="width:800px;height:400px;">' + output + '</textarea>');
    });
});


router.get('/', function(req, res) {
    var packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    var arrayOfModules = [];
    helpers.buildArrayFromObject(packageJson.devDependencies, arrayOfModules, 'key', 'value');
    res.status(200).send(JSON.stringify(arrayOfModules, null, 2));
});

module.exports = router;