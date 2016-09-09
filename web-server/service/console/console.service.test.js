require('should');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
require('should-sinon');

const serverInstance = 'any server instance';

const wsConnection = {
  send: sinon.spy(),
};

const WSInstance = {
  on: sinon.stub().callsArgWith(1, wsConnection),
};

const WSServerMock = {
  Server: sinon.stub().returns(WSInstance),
};

const ConsoleService = proxyquire('./console.service', {
  ws: WSServerMock,
});

describe('Console Service', () => {
  it('should bind to WebSocket connection and message', () => {
    ConsoleService.bind(serverInstance);
    WSServerMock.Server.should.be.calledWith({
      server: serverInstance,
    });

    WSInstance.on.should.be.calledWith('connection');
    WSInstance.on.should.be.calledWith('message');
  });

  it('should send message;', () => {
    ConsoleService.bind(serverInstance);

    ConsoleService.send('message');
    wsConnection.send.should.be.calledWith('message');
  });
});
