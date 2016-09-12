require('should');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
require('should-sinon');

const RxMock = {
  subscribe: sinon.stub().callsArg(0),
  onNext: sinon.stub(),
  onCompleted: sinon.stub(),
};

const RxStub = {
  Observable: {
    create: () => RxMock,
  },
};

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

const ProjectServiceMock = {
  isRepoAvailable: sinon.stub().returns(true),
};

const DependenciesPruneService = proxyquire('./dependencies.prune.service', {
  '../../service/commands/commands.service.js': CommandsServiceMock,
  '../../service/project/project.service.js': ProjectServiceMock,
});

describe('Dependencies Service - Prune module', () => {
  it('should call npm, bower command with bind to console', () => {
    DependenciesPruneService
      .prune()
      .subscribe(() => {
        ProjectServiceMock.isRepoAvailable.should.be.calledWith('npm');
        ProjectServiceMock.isRepoAvailable.should.be.calledWith('bower');

        CommandsServiceMock.run.should
          .be.calledWith(CommandsServiceMock.cmd.npm.prune, true);
        CommandsServiceMock.run.should
          .be.calledWith(CommandsServiceMock.cmd.bower.prune, true);
      });
  });

  xit('should return extraneous packages count', () => {

  });
});
