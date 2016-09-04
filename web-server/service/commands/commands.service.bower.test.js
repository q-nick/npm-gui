require('should');
const CommandsService = require('./commands.service');

describe('Commands:', function runTests() {
  this.timeout(50000);

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
