'use strict';

var consoleSocket = require('../modules/console/console.controller.js');

module.exports.buildArrayFromObject = buildArrayFromObject;
module.exports.buildObjectFromArray = buildObjectFromArray;
module.exports.bindChildStdToConsole = bindChildStdToConsole;
module.exports.isDevModules = isDevModules;
module.exports.isGlobalModules = isGlobalModules;
module.exports.JSONparse = JSONparse;

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

function buildObjectFromArray(sourceArray, destinationObject, keyName) {
    for (var i = 0; i < sourceArray.length; i++) {
        destinationObject[sourceArray[i][keyName]] = sourceArray[i];
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

function isDevModules(req) {
    return req.originalUrl.toUpperCase().indexOf('DEV') !== -1;
}

function isGlobalModules(req) {
    return req.originalUrl.toUpperCase().indexOf('GLOBAL') !== -1;
}

function JSONparse(stringToParse) {
    var result = null;
    try {
        result = JSON.parse(stringToParse);
    } catch (e) {
        return console.error(e);
    }
    return result;
}
