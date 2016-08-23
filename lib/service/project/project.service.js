'use strict';

module.exports.getPath = getPath;
module.exports.setPath = setPath;
module.exports.isBowerAvailable = isBowerAvailable;
module.exports.isNPMAvailable = isNPMAvailable;
module.exports.getBowerJson = getBowerJson;
module.exports.getPackageJson = getPackageJson;

var Rx = require('rx');
var fs = require('fs');
var PackageJson = require('../../model/package-json.js');

var projectPath = process.cwd();

function getPath() {
    return projectPath;
}

function setPath(newProjectPath) {
    projectPath = newProjectPath;
}

function isBowerAvailable() {
    return Rx.Observable.create(function(observer) {
        fs.access(getPath() + '/bower.json', function(err) {
            if (!err) {
                observer.onNext();
            } else {
                observer.onError();
            }
            observer.onCompleted();
        });
    });
}

function isNPMAvailable() {
    return Rx.Observable.create(function(observer) {
        fs.access(getPath() + '/package.json', function(err) {
            if (!err) {
                observer.onNext();
            } else {
                observer.onError();
            }
            observer.onCompleted();
        });
    });
}

function getBowerJson() {
    return new PackageJson(getPath(), 'bower.json');
}

function getPackageJson() {
    return new PackageJson(getPath());
}
