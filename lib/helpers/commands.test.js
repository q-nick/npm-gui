'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var rewire = require('rewire');

var commands = rewire('./commands');

//dont mock spawn,  we  will test real results here (based on package.json)
describe('Commands:', function() {
    this.timeout(15000);

    describe('npm ls:', function() {
        it('should return list of npm-gui dependencies', function(done) {
            commands
                .run(commands.npm.ls)
                .then(function(data) {
                    expect(data.stdout).to.be.a('string');
                    var parsedStdOut = JSON.parse(data.stdout);

                    expect(parsedStdOut).to.be.a('object');
                    expect(parsedStdOut.dependencies).to.be.a('object');
                    //angular
                    expect(parsedStdOut.dependencies.angular).to.be.a('object');
                    expect(parsedStdOut.dependencies.angular.version).to.exist;
                    expect(parsedStdOut.dependencies.angular.from).to.exist;
                    //express
                    expect(parsedStdOut.dependencies.express).to.be.a('object');
                    expect(parsedStdOut.dependencies.express.version).to.exist;
                    expect(parsedStdOut.dependencies.express.from).to.exist;
                    done();
                });
        });
    });

    describe('npm outdated:', function() {
        it('should return list of npm-gui dependencies', function(done) {
            commands
                .run(commands.npm.outdated)
                .then(function(data) {
                    expect(data.stdout).to.be.a('string');
                    var parsedStdOut = JSON.parse(data.stdout);

                    expect(parsedStdOut).to.be.a('object');
                    //angular ui bootstrap
                    expect(parsedStdOut['angular-ui-bootstrap']).to.be.a('object');
                    expect(parsedStdOut['angular-ui-bootstrap'].current).to.exist;
                    expect(parsedStdOut['angular-ui-bootstrap'].latest).to.exist;
                    expect(parsedStdOut['angular-ui-bootstrap'].wanted).to.exist;
                    done();
                });
        });
    });

    describe('npm bin:', function() {
        it('should return path to dependencies binary folder', function(done) {
            commands
                .run(commands.npm.bin)
                .then(function(data) {
                    expect(data.stdout).to.contain('npm-gui');
                    expect(data.stdout).to.contain('.bin');
                    done();
                });
        });
    });

    //TODO run, install, uninstall
});
