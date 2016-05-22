'use strict';

module.exports.whenGet = whenGet;


var helpers = require('../../helpers/helpers.js');
var PackageJson = require('../../helpers/packageJson.js').PackageJson;
var commands = require('../../helpers/commands.js');
var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));

function whenGet(req, res) {
    commands
        .run(commands.npm.bin)
        .then(function(data) {
            return fs.readdirAsync(data.stdout.replace('\n', ''));
        })
        .then(function(data) {
            var binModules = [];
            for (var i = 0; i < data.length; i++) {
                binModules.push({
                    key: data[i]
                });
            }
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(binModules);
        });
}
