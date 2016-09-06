require('should');
const CommandsService = require('./commands.service');
const ProjectService = require('../project/project.service');
const rimraf = require('rimraf');
const fs = require('fs');

describe('Commands:', function runTests() {
  this.timeout(50000);

  ProjectService.setPath(`${process.cwd()}/test-project`);
  const componentsFolderPath = `${ProjectService.getPath()}/bower_components`;

  describe('bower install all:', () => {
    it('should install dependencies listed in bower.json', (done) => {
      rimraf(componentsFolderPath, () => {
        fs.mkdirSync(componentsFolderPath);
        fs.readdirSync(componentsFolderPath).length.should.be.eql(0);

        CommandsService
          .run(CommandsService.cmd.bower.install)
          .subscribe(() => {
            fs.readdirSync(componentsFolderPath).should.containEql('jquery');
            fs.readdirSync(componentsFolderPath).should.containEql('moment');
            fs.readdirSync(componentsFolderPath).should.containEql('jquery-ui');

            done();
          });
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

  describe('bower remove:', () => {
    it('should remove an dependency from folder and bower.json', (done) => {
      fs.readdirSync(componentsFolderPath).should.containEql('jquery-ui');

      CommandsService
        .run(CommandsService.cmd.bower.remove, false, ['jquery-ui', '-S'])
        .subscribe(() => {
          fs.readdirSync(componentsFolderPath).should.not.containEql('jquery-ui');
          fs.readdirSync(componentsFolderPath).should.not.containEql('jquery');

          done();
        });
    });
  });

  describe('bower install dependency:', () => {
    it('should install new dependency and add it to bower.json', (done) => {
      fs.readdirSync(componentsFolderPath).should.not.containEql('jquery-ui');

      CommandsService
        .run(CommandsService.cmd.bower.install, false, ['jquery-ui#^1.11.0', '-S'])
        .subscribe(() => {
          fs.readdirSync(componentsFolderPath).should.containEql('jquery-ui');

          done();
        });
    });
  });

  // TODO install, uninstall, remove, prune, update
});
