require('should'); // eslint-disable-line
const proxyquire = require('proxyquire'); // eslint-disable-line
const sinon = require('sinon'); // eslint-disable-line
require('should-sinon'); // eslint-disable-line

const RxMock = {
  subscribe: sinon.stub().callsArg(0),
};

const CommandsServiceMock = {
  run: sinon.stub().returns(RxMock),
  cmd: {
    npm: {
      dedupe: 'dedupe command',
    },
    bower: {
      dedupe: 'bower dedupe command (unavailable)',
    },
  },
};

const ProjectServiceMock = {
  isRepoAvailable: sinon.stub().returns(true),
};

const DependenciesDedupeService = proxyquire('./dependencies.dedupe.service', {
  '../../service/commands/commands.service.js': CommandsServiceMock,
  '../../service/project/project.service.js': ProjectServiceMock,
});

describe('Dependencies Service - Dedupe module', () => {
  it('should call npm command with bind to console', () => {
    DependenciesDedupeService
      .dedupe()
      .subscribe(() => {
        ProjectServiceMock.isRepoAvailable.should.be.calledWith('npm');
        ProjectServiceMock.isRepoAvailable.should.not.be.calledWith('bower');

        CommandsServiceMock.run.should
          .be.calledWith(CommandsServiceMock.cmd.npm.dedupe, true);
        CommandsServiceMock.run.should
          .not.be.calledWith(CommandsServiceMock.cmd.bower.dedupe, true);
      });
  });
});
