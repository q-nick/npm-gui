import fs from 'fs';
import NpmGuiCore from '../../core';

const CommandsService = NpmGuiCore.Service.Commands;


function whenGet(req, res) {
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
      res.json(binModules);
    });
}

export default {
  whenGet,
};
