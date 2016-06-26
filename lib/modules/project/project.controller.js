'use strict';

module.exports.whenGet = whenGet;


var PackageJson = require('../../helpers/packageJson.js').PackageJson;

function whenGet(req, res) {
    var packageJson = new PackageJson();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(packageJson.getParsed());
}
