'use strict';

var Promise = require('bluebird');
var fs = Promise.promisifyAll(require("fs"));
var Rx = require('rx');

var consoleSocket = require('../modules/console/console.controller.js');

module.exports.buildArrayFromObject = buildArrayFromObject;
module.exports.buildObjectFromArray = buildObjectFromArray;
module.exports.bindChildStdToConsole = bindChildStdToConsole;
module.exports.isDevModules = isDevModules;
module.exports.isGlobalModules = isGlobalModules;
module.exports.JSONparse = JSONparse;
module.exports.isBowerAvailable = isBowerAvailable;
module.exports.isNPMAvailable = isNPMAvailable;
module.exports.isCommandAvailable = isCommandAvailable;
module.exports.getProjectPath = getProjectPath;
module.exports.setProjectPath = setProjectPath;
module.exports.setInArrayByRepoAndKey = setInArrayByRepoAndKey;
module.exports.extend = extend;

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

var projectPath = __dirname;

function getProjectPath() {
    return projectPath;
}

function setProjectPath(newProjectPath) {
    projectPath = newProjectPath;
}

function isCommandAvailable() {

}

function isBowerAvailable() {
    console.log(projectPath);
    return Rx.Observable.create(function(observer) {
        fs.access(getProjectPath() + '/bower.json', function(err) {
            if (!err) {
                observer.onNext();
                observer.onCompleted();
            } else {
                observer.onError();
                observer.onCompleted();
            }
        });
    });
}

function isNPMAvailable() {
    return Rx.Observable.create(function(observer) {
        fs.access(getProjectPath() + '/package.json', function(err) {
            if (!err) {
                observer.onNext();
                observer.onCompleted();
            } else {
                observer.onError();
                observer.onCompleted();
            }
        });
    });
}

function setInArrayByRepoAndKey(repo, keyToFind, valueToFind, keyToSet, valueToSet, arr) {
    var index = arr.findIndex(function(item) {
        return item.repo === repo && item[keyToFind] === valueToFind;
    });

    if (index !== -1) {
        arr[index][keyToSet] = valueToSet;
    }
}

function extend(fromm, to) {
    for (var key in fromm) {
        if (fromm.hasOwnProperty(key)) {
            to[key] = fromm[key];
        }
    }
}
