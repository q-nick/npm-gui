'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var rewire = require('rewire');

var rewirePackageJson = rewire('./packageJson');
var helpers = rewire('./helpers');
var PackageJson = rewirePackageJson.PackageJson;
var packageJson = null;

var packageMock = {
    "dependencies": {
        "angular": "^1.4.8",
        "angular-animate": "^1.4.8"
    },
    "devDependencies": {
        "chai": "^3.4.1",
        "mocha": "^2.3.4"
    },
    "scripts": {
        "start": "./bin/npm-gui",
        "test": "./node_modules/mocha/bin/mocha ./lib/modules/**/*.js"
    },
    "bin": "anynameofbin.js"
};

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
            var toBeLike = [];
            helpers.buildArrayFromObject(packageMock.dependencies, toBeLike, 'key', 'value');
            expect(packageJson.getDependenciesArray()).to.deep.equal(toBeLike);
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
            var toBeLike = [];
            helpers.buildArrayFromObject(packageMock.devDependencies, toBeLike, 'key', 'value');
            expect(packageJson.getDevDependenciesArray()).to.deep.equal(toBeLike);
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
            var toBeLike = [];
            helpers.buildArrayFromObject(packageMock.scripts, toBeLike, 'key', 'value');
            expect(packageJson.getTasksArray()).to.deep.equal(toBeLike);
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
