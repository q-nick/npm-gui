'use strict';

module.exports.whenGet = whenGet;


var path = require('path');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require("fs"));


function whenGet(req, res) {
    fs.readdirAsync(path.normalize('/' + req.params.path))
        .then(function(data) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(data);
        });
}
