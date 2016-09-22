require('should');
// const proxyquire = require('proxyquire');
// const sinon = require('sinon');
// require('should-sinon');
const PackageJson = require('./package-json');

let packageJson = null;

// this would be real files in test-project

describe('PackageJson test', () => {

  beforeEach(() => {
    packageJson = new PackageJson('./test-project');
  });

  describe.only('dependencies', () => {
    it('should list all', () => {
      packageJson.getDependencies().should.be.eql({
        angular: '^1.3.1',
        'angular-ui-bootstrap': '^0.14.3',
        moment: '^2.14.1',
      });
    });

    it('should list all as Array', () => {
      packageJson.getDependenciesArray().should.be.eql([
        {
          key: 'angular', value: '^1.3.1',
        },
        {
          key: 'angular-ui-bootstrap', value: '^0.14.3',
        },
        {
          key: 'moment', value: '^2.14.1',
        },
      ]);
    });

    it('should remove one', () => {
      packageJson.getDependencies().should.have.property('angular');
      packageJson.removeDependence('angular');
      packageJson.getDependencies().should.not.have.property('angular');
    });
  });

  describe('dev dependencies', () => {
    it('should list all', () => {
      packageJson.getDevDependencies().to.deep.equal(packageMock.devDependencies);
    });

    it('should list all as Array', () => {
      packageJson.getDevDependenciesArray().to.deep.equal(resultsMock.devDependencies);
    });

    it('should remove one', () => {
      packageJson.getDependencies()['angular-animate'].to.not.equal(undefined);
      packageJson.removeDependence('angular-animate');
      packageJson.getDependencies()['angular-animate'].to.equal(undefined);
    });
  });

  describe('tasks', () => {
    it('should list all scripts', () => {
      packageJson.getTasks().to.deep.equal(packageMock.scripts);
    });

    it('should list all as Array', () => {
      packageJson.getTasksArray().to.deep.equal(resultsMock.scripts);
    });

    it('should remove one', () => {
      packageJson.getTasks().start.to.not.equal(undefined);
      packageJson.removeTask('start');
      packageJson.getTasks().start.to.equal(undefined);
    });

    it('should add one', () => {
      packageJson.getTasks()['my-start'].to.equal(undefined);
      packageJson.addTask('my-start', 'value');
      packageJson.getTasks()['my-start'].to.not.equal(undefined);
      //TODO writefilesync test
    });
  });

  describe('other', () => {
    it('should return bin string', () => {
      packageJson.getBin().to.equal('anynameofbin.js');
    });
  });
});
