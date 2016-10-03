const UtilsService = require('../../service/utils/utils.service.js');
const CommandsService = require('../../service/commands/commands.service.js');
const ProjectService = require('../../service/project/project.service.js');
const DependenciesService = require('../../service/dependencies/');

module.exports = {
  whenPut(req, res) {
    const repo = req.params.repo;
    const args = [
      req.body.key + (req.body.value ? `@${req.body.value}` : ''),
      UtilsService.isDevDependencies(req) ? '-D' : '-S',
    ];

    CommandsService
      .run(CommandsService.cmd[repo].install, true, args)
      .subscribe(() => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send();
      });
  },

  whenDelete(req, res) {
    const repo = req.params.repo;
    const args = [req.params.name, UtilsService.isDevDependencies(req) ? '-D' : '-S'];

    // this should call method in modulesService
    CommandsService
      .run(CommandsService.cmd[repo].remove, true, args)
      .subscribe(() => {
        // bugfix
        // TODO tests
        const packageJson = ProjectService.getPackageJson(repo);
        if (UtilsService.isDevDependencies(req)) {
          packageJson.removeDevDependence(req.params.name);
        } else {
          packageJson.removeDependence(req.params.name);
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).send();
      });
  },

  whenGet(req, res) {
    DependenciesService
      .get(UtilsService.isDevDependencies(req))
      .subscribe((dependencies) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(dependencies);
      });
  },

  whenGetReinstallAll(req, res) {
    DependenciesService
      .reinstallAllDependencies()
      .subscribe(() => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send();
      });
  },

  whenPostUpdateAll(req, res) {
    const type = req.body.type;
    const isDev = UtilsService.isDevDependencies(req);

    DependenciesService
      .updateAllDependencies(isDev, type)
      .subscribe((dependencies) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(dependencies);
      });
  },

  whenGetNSP(req, res) {
    // this also should call ModulesService for help
    CommandsService
      .run(CommandsService.cmd.nsp.check)
      .subscribe(() => {
        // TODO
        /* const dependencies = {};
        if (data.stderr) {
          UtilsService.buildObjectFromArray(
            UtilsService.parseJSON(data.stderr), dependencies, 'module');
        }*/
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send({});
      });
  },

  whenGetPrune(req, res) {
    DependenciesService
      .prune()
      .subscribe(() => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send({});
      });
  },

  whenGetDedupe(req, res) {
    DependenciesService
      .dedupe()
      .subscribe(() => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send({});
      });
  },
};
