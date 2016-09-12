require('should');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
require('should-sinon');
const ProjectService = require('../project/project.service');
const CommandsService = require('../commands/commands.service');


const sinonSubscribeStub = sinon.stub();
sinonSubscribeStub.withArgs(undefined).callsArg(0);

sinonSubscribeStub.withArgs(CommandsService.cmd.npm.ls).returns({
  stdout: `{
    "dependencies": {
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

sinonSubscribeStub.withArgs(CommandsService.cmd.npm.outdated).returns({
  stdout: `{
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

sinonSubscribeStub.withArgs(CommandsService.cmd.bower.ls).returns({
  stdout: `{
    "dependencies": {
      "jquery-ui": {
        "pkgMeta": {
          "version": "^1.11.0",
        },
        "update": {
          "target": "1.12.0",
          "latest": "1.12.0"
        }
      },
      "moment": {
        "pkgMeta": {
          "target": "^1.11.0",
        },
        "update": {
          "version": "1.12.0",
          "latest": "1.12.0"
        }
      }
    }
  }`,
});

const RxMock = {
  subscribe: sinonSubscribeStub,
  onNext: sinon.stub(),
  onCompleted: sinon.stub(),
};

RxMock.share = sinon.stub().returns(RxMock);

const CommandsServiceMock = {
  run: sinon.stub().returns(RxMock),
  cmd: {
    npm: {
      prune: 'npm prune command',
    },
    bower: {
      prune: 'bower prune command',
    },
  },
};

ProjectService.checkReposAvailability = sinon.stub().returns(RxMock);
ProjectService.isRepoAvailable = sinon.stub().returns(true);

const DependenciesService = proxyquire('./dependencies.service', {
  '../../service/commands/commands.service.js': CommandsServiceMock,
  '../../service/project/project.service.js': ProjectService,
});

describe('Dependencies Service - Base module', () => {
  // we will use real packageJson files from test project

  it('should check dependencies versions and return array', (done) => {
    DependenciesService
      .getModules(false)
      .subscribe((dependencies) => {
        ProjectService.modules.lastId.should.not.be.eql(null);
        ProjectService.devModules.lastId.should.not.be.eql(null);

        ProjectService.checkReposAvailability.should.be.called();

        ProjectService.isRepoAvailable.should.be.calledWith('npm');
        ProjectService.isRepoAvailable.should.be.calledWith('bower');

        CommandsServiceMock.run.should
          .be.calledWith(CommandsServiceMock.cmd.npm.ls, true);
        CommandsServiceMock.run.should
          .be.calledWith(CommandsServiceMock.cmd.npm.outdated, true);
        CommandsServiceMock.run.should
          .be.calledWith(CommandsServiceMock.cmd.bower.ls, true);
        done();
      });
  });
});
