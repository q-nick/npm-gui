import NpmGuiCore from '../../core';

const CommandsService = NpmGuiCore.Service.Commands;

const PackageJson = NpmGuiCore.Model.PackageJson;

function whenGet(req, res) {
  const packageJson = new PackageJson();
  res.json(packageJson.getTasksArray());
}

function whenPut(req, res) {
  const packageJson = new PackageJson();
  packageJson.addTask(req.body.key, req.body.value);
  res.json();
}

function whenDelete(req, res) {
  const packageJson = new PackageJson();
  packageJson.removeTask(req.params.name);
  res.json();
}

function whenPost(req, res) {
  CommandsService
      .run(CommandsService.cmd.npm.run, true, [req.params.name])
      .then(() => {
        res.json();
      });
}

function whenGetHelp(req, res) {
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
        res.json({
          text: (data.stdout + data.stderr),
          flags: (data.stdout + data.stderr).match(/[-]{1,2}[a-zA-Z0-9]+/g),
        });
      });
}

export default {
  whenGet,
  whenPut,
  whenPost,
  whenGetHelp,
  whenDelete,
};
