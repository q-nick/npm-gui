const path = require('path');
const ProjectService = require('../../service/project/project.service.js');

module.exports = {
  whenGet(req, res) {
    const packageJsonParsed = ProjectService.getPackageJson().getParsed();
    packageJsonParsed.projectPath = ProjectService.getPath();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(packageJsonParsed);
  },

  whenPut(req, res) {
    ProjectService.setProjectPath(path.normalize(`/${req.params.path}`));

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send({});
  },
};
