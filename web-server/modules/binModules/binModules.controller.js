const CommandsService = require('../../service/commands/commands.service.js');
const fs = require('fs');

module.exports = {
  whenGet(req, res) {
    CommandsService
      .run(CommandsService.cmd.npm.bin)
      .then((data) => fs.readdirAsync(data.stdout.replace('\n', '')))
      .then((data) => {
        const binModules = [];
        for (let i = 0; i < data.length; i++) {
          binModules.push({
            key: data[i],
          });
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(binModules);
      });
  },
};
