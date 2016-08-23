'use strict';

module.exports.whenGet = whenGet;
module.exports.whenPut = whenPut;


var path = require('path');
var ProjectService = require('../../service/project/project.service.js');

function whenGet(req, res) {
    var packageJsonParsed = ProjectService.getPackageJson().getParsed();
    packageJsonParsed.projectPath = ProjectService.getPath();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(packageJsonParsed);
}

function whenPut(req, res) {
    ProjectService.setProjectPath(path.normalize('/' + req.params.path));

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send({});
}
