const PackageJson = require('../../model/package-json.js').PackageJson;
const CommandsService = require('../../service/commands/commands.service.js');

module.exports = {
  whenGet(req, res) {
    const packageJson = new PackageJson();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(packageJson.getTasksArray());
  },

  whenPut(req, res) {
    const packageJson = new PackageJson();
    packageJson.addTask(req.body.key, req.body.value);
    res.status(200).send();
  },

  whenDelete(req, res) {
    const packageJson = new PackageJson();
    packageJson.removeTask(req.params.name);
    res.status(200).send();
  },

  whenPost(req, res) {
    CommandsService
      .run(CommandsService.cmd.npm.run, true, [req.params.name])
      .then(() => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send();
      });
  },

  whenGetHelp(req, res) {
    CommandsService
      .run(CommandsService.cmd.npm.bin)
      .then((data) =>
        CommandsService
          .run({
            command: 'node',
            args: [`${data.stdout.replace('\n', '')}/${req.params.name}`, '--help'],
          })
      )
      .then((data) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send({
          text: (data.stdout + data.stderr),
          flags: (data.stdout + data.stderr).match(/[\-]{1,2}[a-zA-Z0-9]+/g),
        });
      });
  },
};
