require('should');
const CommandsService = require('./commands.service');
const ProjectService = require('../project/project.service');

describe.only('Commands:', function runTests() {
  this.timeout(50000);

  beforeEach(() => {
    ProjectService.setPath(`${process.cwd()}/test-project`);
  });

  describe('npm install:', () => {
    it('should install dependencies listed in package.json', (done) => {
      CommandsService
        .run(CommandsService.cmd.npm.install)
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

  describe('npm ls:', () => {
    it('should return list of npm-gui dependencies', (done) => {
      CommandsService
        .run(CommandsService.cmd.npm.ls)
        .subscribe((data) => {
          data.stdout.should.be.String();
          const parsedStdOut = JSON.parse(data.stdout);

          parsedStdOut.should.be.an.Object();
          parsedStdOut.should.have.property('dependencies').and.be.Object();

          const dependencies = parsedStdOut.dependencies;

          dependencies.angular.should.be.an.Object();
          dependencies.angular.should.have.property('version');
          dependencies.angular.should.have.property('from');

          dependencies.moment.should.be.an.Object();
          dependencies.moment.should.have.property('version');
          dependencies.moment.should.have.property('from');

          done();
        });
    });
  });
  // we have to install some dependencies then test that they are old

  describe('npm outdated:', () => {
    it('should return list of npm-gui dependencies', (done) => {
      CommandsService
        .run(CommandsService.cmd.npm.outdated)
        .subscribe((data) => {
          data.stdout.should.be.String();
          const parsedStdOut = JSON.parse(data.stdout);

          parsedStdOut.should.be.an.Object();
          // angular ui bootstrap
          parsedStdOut['angular-ui-bootstrap'].should.be.an.Object();
          parsedStdOut['angular-ui-bootstrap'].should.have.property('current');
          parsedStdOut['angular-ui-bootstrap'].should.have.property('latest');
          parsedStdOut['angular-ui-bootstrap'].should.have.property('wanted');
          done();
        });
    });
  });

  describe('npm bin:', () => {
    it('should return path to dependencies binary folder', (done) => {
      CommandsService
        .run(CommandsService.cmd.npm.bin)
        .subscribe((data) => {
          data.stdout.should.be.String();

          data.stdout.should.match(/npm-gui/);
          data.stdout.should.match(/\.bin/);
          done();
        });
    });
  });

  // TODO create special folder/project to execute tests commands
  // TODO install, uninstall, remove, run?, prune, dedupe, update, shrinkwrap
});
