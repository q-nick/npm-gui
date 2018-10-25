require('should'); // eslint-disable-line
// const proxyquire = require('proxyquire');
const sinon = require('sinon'); // eslint-disable-line
require('should-sinon'); // eslint-disable-line

const Utils = require('./utils.service');

describe('Utils', () => {
  describe('isDevDependencies', () => {
    it('should return true', () => {
      Utils.isDevDependencies({
        originalUrl: '/devModules',
      }).should.be.eql(true);

      Utils.isDevDependencies({
        originalUrl: '/dev',
      }).should.be.eql(true);

      Utils.isDevDependencies({
        originalUrl: '/modulesDev',
      }).should.be.eql(true);

      Utils.isDevDependencies({
        originalUrl: '/modules-dev',
      }).should.be.eql(true);
    });

    it('should return false', () => {
      Utils.isDevDependencies({
        originalUrl: '/modules',
      }).should.be.eql(false);

      Utils.isDevDependencies({
        originalUrl: '/public',
      }).should.be.eql(false);

      Utils.isDevDependencies({
        originalUrl: '/controller',
      }).should.be.eql(false);
    });
  });

  describe('isGlobalPackages', () => {
    it('should return true', () => {
      Utils.isGlobalPackages({
        originalUrl: '/globalModules',
      }).should.be.eql(true);

      Utils.isGlobalPackages({
        originalUrl: '/global',
      }).should.be.eql(true);
    });

    it('should return false', () => {
      Utils.isGlobalPackages({
        originalUrl: '/modules',
      }).should.be.eql(false);

      Utils.isGlobalPackages({
        originalUrl: '/public',
      }).should.be.eql(false);
    });
  });

  describe('buildArrayFromObject', () => {
    it('should build array', () => {
      const jsonObj = {
        start: 'startvalue',
        test: 'testvalue',
        browserify: 'browserifyvalue',
      };
      const arrayOfTasks = [];
      Utils.buildArrayFromObject(jsonObj, arrayOfTasks, 'key', 'value');


      arrayOfTasks[0].key.should.be.eql('start');
      arrayOfTasks[0].value.should.be.eql('startvalue');
      arrayOfTasks[1].key.should.be.eql('test');
      arrayOfTasks[1].value.should.be.eql('testvalue');
      arrayOfTasks[2].key.should.be.eql('browserify');
      arrayOfTasks[2].value.should.be.eql('browserifyvalue');
    });
  });

  describe('buildObjectFromArray', () => {
    it('should build object', () => {
      const jsonObj = {};
      const arrayOfTasks = [{
        title: 'any',
      }, {
        title: 'anyone',
      }, {
        title: 'anytwo',
      }];
      Utils.buildObjectFromArray(arrayOfTasks, jsonObj, 'title');


      jsonObj.any.title.should.be.eql('any');
      jsonObj.anyone.title.should.be.eql('anyone');
      jsonObj.anytwo.title.should.be.eql('anytwo');
    });
  });

  describe('parseJSON', () => {
    it('should not throw error when json string is invalid', () => {
      Utils.parseJSON('not json string');
      (1).should.be.eql(1);
    });

    it('should normally parse when json string is valid', () => {
      const parsed = Utils.parseJSON('{"is":"json"}');
      parsed.is.should.be.eql('json');
    });
  });

  describe('findInArrayByRepoAndKey', () => {
    it('should find item', () => {
      const arr = [{
        repo: 'npm',
        field: 'packet',
      }, {
        repo: 'bower',
        field: 'packet',
      }, {
        repo: 'npm',
        field: 'bad packet',
      }];

      const found = Utils.findInArrayByRepoAndKey('npm', 'field', 'packet', arr);

      found.repo.should.be.eql('npm');
      found.field.should.be.eql('packet');
    });
  });

  describe('setInArrayByRepoAndKey', () => {
    it('should find item and set value', () => {
      const arr = [{
        repo: 'npm',
        field: 'packet',
      }, {
        repo: 'bower',
        field: 'packet',
      }, {
        repo: 'npm',
        field: 'bad packet',
      }];

      Utils.setInArrayByRepoAndKey('npm', 'field', 'packet', 'some', 'newValue', arr);

      const found = Utils.findInArrayByRepoAndKey('npm', 'field', 'packet', arr);

      found.repo.should.be.eql('npm');
      found.field.should.be.eql('packet');
      found.some.should.be.eql('newValue');
    });
  });

  describe('extend', () => {
    it('should extend object', () => {
      const ob1 = {
        a: 1,
        b: 2,
      };

      const ob2 = {
        c: 3,
        d: 4,
      };

      Utils.extend(ob1, ob2);
      ob2.should.have.property('a');
      ob2.a.should.be.eql(1);
      ob2.should.have.property('b');
      ob2.b.should.be.eql(2);
    });
  });
});
