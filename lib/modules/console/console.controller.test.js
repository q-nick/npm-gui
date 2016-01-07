var chai = require('chai').should();
var expect = chai.expect;
var sinon = require('sinon');

var consoleController = require('./console.controller');

describe('Console Controller', function() {
    it('should bind to websocket', function() {
        //escape('&').should.equal('&amp;');
    });

    it('should send message;', function() {
        //escape('\"').should.equal('&quot;');
        consoleController.send('any message');
    });
});
