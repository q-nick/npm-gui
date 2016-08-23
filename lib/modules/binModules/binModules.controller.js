'use strict';

module.exports.whenGet = whenGet;

var CommandsService = require('../../service/commands/commands.service.js');

function whenGet(req, res) {
    var binSource = CommandsService
        .run(CommandsService.cmd.npm.bin)
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
