'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var rewire = require('rewire');

var helpers = rewire('./helpers');

describe('Helpers test', function() {

    describe('method isDevModules', function() {
        it('should return true', function() {
            expect(helpers.isDevModules({originalUrl: '/devModules'})).to.equal(true);
            expect(helpers.isDevModules({originalUrl: '/dev'})).to.equal(true);
            expect(helpers.isDevModules({originalUrl: '/modulesDev'})).to.equal(true);
            expect(helpers.isDevModules({originalUrl: '/modules-dev'})).to.equal(true);
        });

        it('should return false', function() {
            expect(helpers.isDevModules({originalUrl: '/modules'})).to.equal(false);
            expect(helpers.isDevModules({originalUrl: '/public'})).to.equal(false);
            expect(helpers.isDevModules({originalUrl: '/controller'})).to.equal(false);
        });
    });

    describe('method buildArrayFromObject', function() {
        it('should build array', function() {
            var jsonObj = {
                "start": "startvalue",
                "test": "testvalue",
                "browserify": "browserifyvalue"
            };
            var arrayOfTasks = [];
            helpers.buildArrayFromObject(jsonObj, arrayOfTasks, 'key', 'value');


            expect(arrayOfTasks[0].key).to.equal('start');
            expect(arrayOfTasks[0].value).to.equal('startvalue');
            expect(arrayOfTasks[1].key).to.equal('test');
            expect(arrayOfTasks[1].value).to.equal('testvalue');
            expect(arrayOfTasks[2].key).to.equal('browserify');
            expect(arrayOfTasks[2].value).to.equal('browserifyvalue');
        });
    });

    xdescribe('method bindChildStdToConsole', function() {
        it('should bind stdout, stderr, and stdin to console', function() {

            // given
            var consoleSocket = {
                send: sinon.spy()
            };

            var child = {
                stdout: {on: sinon.spy()},
                stderr: {on: sinon.spy()},
                stdin: {on: sinon.spy()}
            };

            helpers.bindChildStdToConsole(child);

            expect(child.stdout.on.calledWith('data')).to.equal(true);
            expect(child.stderr.on.calledWith('data')).to.equal(true);
            expect(child.stdin.on.calledWith('data')).to.equal(true);

            //TODO expect(consoleSocket.send.called).to.equal(true);
        });
    });
});
