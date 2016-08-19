'use strict';

module.exports.whenGet = whenGet;


var path = require('path');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require("fs"));


function whenGet(req, res) {
    var normalizedPath = path.normalize('/' + req.params.path);
    fs.readdirAsync(normalizedPath)
        .then(function(data) {
            var dataToReturn = [];
            for (var i = 0; i < data.length; i++) {
                var fileStat = fs.lstatSync(normalizedPath + '/' + data[i]);
                dataToReturn.push({
                    directory: fileStat.isDirectory(),
                    name: data[i]
                });
            };
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send({
                path: normalizedPath,
                files: dataToReturn
            })
        })
        .catch(function(err) {
            console.error(err);
            res.setHeader('Content-Type', 'application/json');
            res.status(404).send({});
        });
}
