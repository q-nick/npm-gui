require('should');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
require('should-sinon');

const ProjectServiceMock = {
  getPath: sinon.stub().returns('somePath'),
};

const ConsoleServiceMock = {
  send: sinon.spy(),
};

const stdoutMock = {
  on: sinon.stub().callsArgWith(1, 'stdout data'),
};

const stderrMock = {
  on: sinon.stub().callsArgWith(1, 'stderr data'),
};

const CrossSpawnMock = sinon.stub().returns({
  stdout: stdoutMock,
  stderr: stderrMock,
  on: sinon.stub().callsArg(1),
});

const CommandsService = proxyquire('./commands.service', {
  '../project/project.service.js': ProjectServiceMock,
  '../console/console.service.js': ConsoleServiceMock,
  'cross-spawn': CrossSpawnMock,
});

describe('Commands Service:', () => {
  beforeEach(() => {
    ConsoleServiceMock.send.reset();
    stdoutMock.on.reset();
    stderrMock.on.reset();
    CrossSpawnMock.reset();
  });

  describe('cmd constants:', () => {
    it('should contain constants', () => {
      CommandsService.should.have.property('cmd');
      CommandsService.cmd.should.have.property('bower');
      CommandsService.cmd.should.have.property('npm');
      CommandsService.cmd.should.have.property('nsp');

      // few base commands
      CommandsService.cmd.bower.should.have.property('install');
      CommandsService.cmd.npm.should.have.property('install');
      CommandsService.cmd.nsp.should.have.property('check');
    });
  });

  describe('run:', () => {
    it('should call system spawn method', (done) => {
      CommandsService
        .run(CommandsService.cmd.npm.ls)
        .subscribe((data) => {
          CrossSpawnMock.should.be.calledWith('npm', ['ls', '--depth=0', '--json'], {
            cwd: 'somePath',
          });
          data.stdout.should.be.String().and.startWith('stdout data');
          data.stderr.should.be.String().and.startWith('stderr data');
          done();
        });
    });

    it('should call system spawn method and bind stdout to console', (done) => {
      CommandsService
        .run(CommandsService.cmd.npm.ls, true)
        .subscribe(() => {
          CrossSpawnMock.should.be.calledOnce();// don't need to test arguments

          ConsoleServiceMock.send.getCall(1)
            .should.be.calledWith('start: npm ls,--depth=0,--json\n');

          ConsoleServiceMock.send.getCall(1)
            .should.be.calledWith('stdout data');

          ConsoleServiceMock.send.getCall(2)
            .should.be.calledWith('stderr data');

          done();
        });
    });

    it('should call system spawn method and add given args to command', (done) => {
      CommandsService
        .run(CommandsService.cmd.npm.ls, false, ['some', 'other', 'args'])
        .subscribe(() => {
          CrossSpawnMock.should.be
            .calledWith('npm', ['ls', '--depth=0', '--json', 'some', 'other', 'args']);
          done();
        });
    });
  });
});
