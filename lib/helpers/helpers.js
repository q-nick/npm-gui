'use strict';

var consoleSocket = require('../modules/console/console.controller.js');

module.exports.buildArrayFromObject = buildArrayFromObject;
module.exports.bindChildStdToConsole = bindChildStdToConsole;
module.exports.isDevModules = isDevModules;

/////////////////////

function buildArrayFromObject(sourceObject, destinationArray, keyName, valueName) {
    for (var key in sourceObject) {
        if (sourceObject.hasOwnProperty(key)) {
            var obj = {};
            obj[keyName] = key;
            obj[valueName] = sourceObject[key];
            destinationArray.push(obj);
        }
    }
}

function bindChildStdToConsole(child) {
    child.stdout.on('data', function(data) {
        consoleSocket.send(data.toString());
    });

    child.stderr.on('data', function(data) {
        consoleSocket.send(data.toString());
    });

    child.stdin.on('data', function(data) {
        consoleSocket.send(data.toString());
    });
}

function isDevModules(req){
    return req.originalUrl.toUpperCase().indexOf('DEV') !== -1;
}