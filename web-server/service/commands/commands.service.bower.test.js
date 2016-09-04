require('should');
const CommandsService = require('./commands.service');
const ProjectService = require('../project/project.service');

describe('Commands:', function runTests() {
  this.timeout(50000);

  beforeEach(() => {
    ProjectService.setPath(`${process.cwd()}/test-project`);
  });

  describe('bower install:', () => {
    it('should install dependencies listed in package.json', (done) => {
      CommandsService
        .run(CommandsService.cmd.bower.install)
        .subscribe((data) => {
          console.log(data);
          /*data.stdout.should.be.String();
           const parsedStdOut = JSON.parse(data.stdout);

           parsedStdOut.should.be.an.Object();
           parsedStdOut.should.have.property('dependencies').and.be.Object();

           const dependencies = parsedStdOut.dependencies;

           dependencies.angular.should.be.an.Object();
           dependencies.angular.should.have.property('version');
           dependencies.angular.should.have.property('from');

           dependencies.express.should.be.an.Object();
           dependencies.express.should.have.property('version');
           dependencies.express.should.have.property('from');*/

          done();
        });
    });
  });

  describe('bower ls:', () => {
    it('should return list of npm-gui dependencies', (done) => {
      CommandsService
        .run(CommandsService.cmd.bower.ls)
        .subscribe((data) => {
          data.stdout.should.be.String();
          const parsedStdOut = JSON.parse(data.stdout);

          parsedStdOut.should.be.an.Object();
          parsedStdOut.should.have.property('dependencies').and.be.Object();

          const dependencies = parsedStdOut.dependencies;

          dependencies.moment.should.be.an.Object();
          dependencies.moment.should.have.property('pkgMeta');
          // installed version
          dependencies.moment.pkgMeta.should.have.property('version');

          // outdated versions
          dependencies.moment.update.should.have.property('target');
          dependencies.moment.update.should.have.property('latest');

          done();
        });
    });
  });

  // TODO install, uninstall, remove, prune, update
});
