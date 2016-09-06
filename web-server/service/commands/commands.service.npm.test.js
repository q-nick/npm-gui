require('should');
const CommandsService = require('./commands.service');
const ProjectService = require('../project/project.service');
const rimraf = require('rimraf');
const fs = require('fs');

describe('Commands:', function runTests() {
  this.timeout(50000);

  ProjectService.setPath(`${process.cwd()}/test-project`);
  const componentsFolderPath = `${ProjectService.getPath()}/node_modules`;

  describe('npm install all:', () => {
    it('should install dependencies listed in package.json', (done) => {
      rimraf(componentsFolderPath, () => {
        fs.mkdirSync(componentsFolderPath);
        fs.readdirSync(componentsFolderPath).length.should.be.eql(0);

        CommandsService
          .run(CommandsService.cmd.npm.install)
          .subscribe(() => {
            fs.readdirSync(componentsFolderPath).should.containEql('angular');
            fs.readdirSync(componentsFolderPath).should.containEql('moment');
            fs.readdirSync(componentsFolderPath).should.containEql('angular-ui-bootstrap');

            done();
          });
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

  describe('npm remove:', () => {
    it('should remove an dependency from folder and package.json', (done) => {
      fs.readdirSync(componentsFolderPath).should.containEql('angular');

      CommandsService
        .run(CommandsService.cmd.npm.remove, false, ['angular', '-S'])
        .subscribe(() => {
          fs.readdirSync(componentsFolderPath).should.not.containEql('angular');

          done();
        });
    });
  });

  describe('npm install dependency:', () => {
    it('should install new dependency and add it to bower.json', (done) => {
      fs.readdirSync(componentsFolderPath).should.not.containEql('angular');

      CommandsService
        .run(CommandsService.cmd.npm.install, false, ['angular@1.3.1', '-S'])
        .subscribe(() => {
          fs.readdirSync(componentsFolderPath).should.containEql('angular');

          done();
        });
    });
  });

  // TODO create special folder/project to execute tests commands
  // TODO install, uninstall, remove, run?, prune, dedupe, update, shrinkwrap
});
