'use strict';

module.exports.buildArrayFromObject = buildArrayFromObject;
module.exports.buildObjectFromArray = buildObjectFromArray;
module.exports.isDevModules = isDevModules;
module.exports.isGlobalModules = isGlobalModules;
module.exports.JSONparse = JSONparse;
module.exports.setInArrayByRepoAndKey = setInArrayByRepoAndKey;
module.exports.findInArrayByRepoAndKey = findInArrayByRepoAndKey;
module.exports.extend = extend;

/////////////////////

var fs = require('fs');
var Rx = require('rx');
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

function setInArrayByRepoAndKey(repo, keyToFind, valueToFind, keyToSet, valueToSet, arr) {
    var item = findInArrayByRepoAndKey(repo, keyToFind, valueToFind, arr);

    if (item) {
        item[keyToSet] = valueToSet;
    }
}

function findInArrayByRepoAndKey(repo, keyToFind, valueToFind, arr) {
    var index = arr.findIndex(function(item) {
        return item.repo === repo && item[keyToFind] === valueToFind;
    });

    return arr[index];
}

function extend(source, destination) {
    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            destination[key] = source[key];
        }
    }
}
