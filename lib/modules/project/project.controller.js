'use strict';

module.exports.whenGet = whenGet;
module.exports.whenPut = whenPut;


var path = require('path');
var helpers = require('../../helpers/helpers.js');
var PackageJson = require('../../helpers/packageJson.js').PackageJson;

function whenGet(req, res) {
    var packageJson = new PackageJson();
    var packageJsonParsed = packageJson.getParsed();
    packageJsonParsed.projectPath = packageJson.getPath();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(packageJsonParsed);
}

function whenPut(req, res) {
    helpers.setProjectPath(path.normalize('/' + req.params.path));

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send({});
}
