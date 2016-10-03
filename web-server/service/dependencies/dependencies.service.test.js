require('should');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
require('should-sinon');
const CommandsService = require('../commands/commands.service');
const Rx = require('rx');

const CommandsServiceRunMock = sinon.stub();

const npmLsSubject = new Rx.Subject();
const npmOutdatedSubject = new Rx.Subject();
const npmBowerLsSubject = new Rx.Subject();

CommandsServiceRunMock.withArgs(CommandsService.cmd.npm.ls).returns(npmLsSubject);
CommandsServiceRunMock.withArgs(CommandsService.cmd.npm.outdated).returns(npmOutdatedSubject);
CommandsServiceRunMock.withArgs(CommandsService.cmd.bower.ls).returns(npmBowerLsSubject);

const CommandsServiceMock = {
  run: CommandsServiceRunMock,
};

const RxMockSimple = {
  subscribe: sinon.stub().callsArg(0),
};

const ProjectServiceMock = {
  checkReposAvailability: sinon.stub().returns(RxMockSimple),
  isRepoAvailable: sinon.stub().returns(true),
};

const DependenciesService = proxyquire('./dependencies.service', {
  '../../service/commands/commands.service.js': CommandsServiceMock,
  '../../service/project/project.service.js': ProjectServiceMock,
});

describe('Dependencies Service - Base module', () => {
  // we will use real packageJson files from test project

  it('should check dependencies versions and return array', (done) => {
    DependenciesService
      .getModules(false)
      .subscribe((dependencies) => {
        ProjectServiceMock.checkReposAvailability.should.be.called();

        ProjectServiceMock.isRepoAvailable.should.be.calledWith('npm');
        ProjectServiceMock.isRepoAvailable.should.be.calledWith('bower');

        // npm
        dependencies.should.containEql({
          key: 'angular',
          value: '^1.3.1',
          repo: 'npm',
          version: '1.0.0',
          wanted: '1.5.8',
          latest: '1.5.8',
        });
        dependencies.should.containEql({
          key: 'angular-ui-bootstrap',
          value: '^0.14.3',
          repo: 'npm',
          version: '0.14.3',
          latest: '2.1.3',
        });
        dependencies.should.containEql({
          key: 'moment',
          value: '^2.14.1',
          repo: 'npm',
          version: '2.14.1',
        });

        // bower
        dependencies.should.containEql({
          key: 'jquery-ui',
          value: '^1.11.0',
          repo: 'bower',
          version: '^1.11.0',
          wanted: '1.12.0',
          latest: '1.12.0',
        });
        done();
      });

    setTimeout(() => {
      npmLsSubject.onNext({
        stdout: `{
          "dependencies": {
            "jquery": {
              "version": "1.3.1"
            },
            "angular": {
              "version": "1.0.0"
            },
            "angular-ui-bootstrap": {
              "version": "0.14.3"
            },
            "moment": {
              "version": "2.14.1"
            }
          }
        }`,
      });

      npmOutdatedSubject.onNext({
        stdout: `{
          "jquery": {
            "current": "1.3.1",
            "wanted": "1.5.8",
            "latest": "1.5.8"
          },
          "angular": {
            "current": "1.3.1",
            "wanted": "1.5.8",
            "latest": "1.5.8"
          },
          "angular-ui-bootstrap": {
            "current": "0.14.3",
            "wanted": "0.14.3",
            "latest": "2.1.3"
          },
          "moment": {
            "version": "2.14.1"
          }
        }`,
      });

      npmBowerLsSubject.onNext({
        stdout: `{
          "dependencies": {
            "jquery-ui": {
              "pkgMeta": {
                "version": "^1.11.0"
              },
              "update": {
                "target": "1.12.0",
                "latest": "1.12.0"
              }
            },
            "moment": {
              "pkgMeta": {
                "version": "^2.2.1"
              },
              "update": {
                "target": "2.3.0",
                "latest": "3.0.0"
              }
            }
          }
        }`,
      });

      npmLsSubject.onCompleted();
      npmOutdatedSubject.onCompleted();
      npmBowerLsSubject.onCompleted();
    });
  });

  it('should check devDependencies versions and return array', (done) => {
    DependenciesService
      .getModules(true)
      .subscribe((devDependencies) => {
        ProjectServiceMock.checkReposAvailability.should.be.called();

        ProjectServiceMock.isRepoAvailable.should.be.calledWith('npm');
        ProjectServiceMock.isRepoAvailable.should.be.calledWith('bower');

        devDependencies.should.containEql({
          key: 'jquery',
          value: '^1.3.1',
          repo: 'npm',
          version: '1.3.1',
          wanted: '1.5.8',
          latest: '1.5.8',
        });

        // bower
        devDependencies.should.containEql({
          key: 'moment',
          value: '^2.2.1',
          repo: 'bower',
          version: '^2.2.1',
          wanted: '2.3.0',
          latest: '3.0.0',
        });
        done();
      });
  });
});
