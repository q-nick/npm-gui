'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var rewire = require('rewire');

var rewirePackageJson = rewire('./packageJson');
var helpers = rewire('./helpers');
var PackageJson = rewirePackageJson.PackageJson;
var packageJson = null;

var packageMock = require('../test/packageJson.mock').mock;
var resultsMock = require('../test/packageJson.mock').resultsMock;

var fsMock = {
    readFileSync: function() {
        return JSON.stringify(packageMock);
    },
    writeFileSync: sinon.spy()
};

describe('PackageJson test', function() {

    before(function() {
        rewirePackageJson.__set__({
            'fs': fsMock
        });

        packageJson = new PackageJson();
    });

    describe('dependencies', function() {
        it('should list all', function() {
            expect(packageJson.getDependencies()).to.deep.equal(packageMock.dependencies);
        });

        it('should list all as Array', function() {
            expect(packageJson.getDependenciesArray()).to.deep.equal(resultsMock.dependencies);
        });

        it('should remove one', function() {
            expect(packageJson.getDependencies()['angular']).to.not.equal(undefined);
            packageJson.removeDependence('angular');
            expect(packageJson.getDependencies()['angular']).to.equal(undefined);
        });
    });

    describe('dev dependencies', function() {
        it('should list all', function() {
            expect(packageJson.getDevDependencies()).to.deep.equal(packageMock.devDependencies);
        });

        it('should list all as Array', function() {
            expect(packageJson.getDevDependenciesArray()).to.deep.equal(resultsMock.devDependencies);
        });

        it('should remove one', function() {
            expect(packageJson.getDependencies()['angular-animate']).to.not.equal(undefined);
            packageJson.removeDependence('angular-animate');
            expect(packageJson.getDependencies()['angular-animate']).to.equal(undefined);
        });
    });

    describe('tasks', function() {
        it('should list all scripts', function() {
            expect(packageJson.getTasks()).to.deep.equal(packageMock.scripts);
        });

        it('should list all as Array', function() {
            expect(packageJson.getTasksArray()).to.deep.equal(resultsMock.scripts);
        });

        it('should remove one', function() {
            expect(packageJson.getTasks()['start']).to.not.equal(undefined);
            packageJson.removeTask('start');
            expect(packageJson.getTasks()['start']).to.equal(undefined);
        });

        it('should add one', function() {
            expect(packageJson.getTasks()['my-start']).to.equal(undefined);
            packageJson.addTask('my-start', 'value');
            expect(packageJson.getTasks()['my-start']).to.not.equal(undefined);
            //TODO writefilesync test
        });
    });

    describe('other', function() {
        it('should return bin string', function() {
            expect(packageJson.getBin()).to.equal('anynameofbin.js');
        });
    });
});
