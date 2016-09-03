const UtilsService = require('../../service/utils/utils.service.js');
const CommandsService = require('../../service/commands/commands.service.js');
const PackageJson = require('../../model/package-json.js').PackageJson;
const ModulesService = require('../../service/modules/modules.service.js');

module.exports = {
  whenPut(req, res) {
    const putCommand = JSON.parse(JSON.stringify(CommandsService.cmd[req.params.repo].install));
    putCommand.args.push(req.body.key + (req.body.value ? '@' + req.body.value : ''));
    putCommand.args.push(UtilsService.isDevModules(req) ? '-D' : '-S');

    CommandsService
      .run(putCommand, true)
      .subscribe(() => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send();
      });
  },

  whenDelete(req, res) {
    const removeCommand = JSON.parse(JSON.stringify(CommandsService.cmd[req.params.repo].remove));
    removeCommand.args.push(req.params.name);
    removeCommand.args.push(UtilsService.isDevModules(req) ? '-D' : '-S');

    CommandsService
      .run(removeCommand, true)
      .then(() => {
        /// bugfix
        // TODO tests
        const packageJson = new PackageJson();
        if (UtilsService.isDevModules(req)) {
          packageJson.removeDevDependence(req.params.name);
        } else {
          packageJson.removeDependence(req.params.name);
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).send();
      });
  },

  whenGetInstall(req, res) {
    ModulesService
      .reinstallAllModules()
      .subscribe(() => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send();
      });
  },

  whenGet(req, res) {
    const isDev = UtilsService.isDevModules(req);

    ModulesService
      .getModules(isDev)
      .subscribe((dependencies) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(dependencies);
      });
  },

  whenGetNSP(req, res) {
    CommandsService
      .run(CommandsService.cmd.nsp.check)
      .subscribe((data) => {
        const dependencies = {};
        if (data.stderr) {
          UtilsService.buildObjectFromArray(
            UtilsService.JSONparse(data.stderr), dependencies, 'module');
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(dependencies);
      });
  },

  whenGetPrune(req, res) {
    ModulesService
      .prune()
      .subscribe(() => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send({});
      });
  },

  whenGetDedupe(req, res) {
    ModulesService
      .dedupe()
      .subscribe(() => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send({});
      });
  },

  whenPostUpdateAll(req, res) {
    const type = req.body.type;
    const isDev = UtilsService.isDevModules(req);

    ModulesService
      .updateAllModules(isDev, type)
      .subscribe((dependencies) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(dependencies);
      });
  },
};
