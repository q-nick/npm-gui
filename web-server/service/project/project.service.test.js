require('should');

const ProjectService = require('./project.service');

describe('ProjectService', () => {
  beforeEach(() => {
    ProjectService.setPath(`${process.cwd()}/test-project`);
  });

  describe('checkReposAvailability, isRepoAvailable', () => {
    it('should check repos availability when true', () => {
      ProjectService.checkReposAvailability()
        .subscribe(() => {
          ProjectService.isRepoAvailable('bower').should.be.eql(true);
          ProjectService.isRepoAvailable('npm').should.be.eql(true);
        });
    });

    it('should check repos availability when false', () => {
      ProjectService.setPath(`${process.cwd()}/test-project/empty`);

      ProjectService.checkReposAvailability()
        .subscribe(() => {
          ProjectService.isRepoAvailable('bower').should.be.eql(false);
          ProjectService.isRepoAvailable('npm').should.be.eql(false);
          ProjectService.setPath(`${process.cwd()}/test-project/empty`);
        });
    });
  });

  describe('getPath, setPath', () => {
    it('should change path and return properly', () => {
      ProjectService.getPath().should.be.eql(`${process.cwd()}/test-project`);

      ProjectService.setPath(`${process.cwd()}/test-project/empty`);

      ProjectService.getPath().should.be.eql(`${process.cwd()}/test-project/empty`);
    })
  });

  describe('async isRepoAvailableTest', () => {
    describe('bower', () => {
      it('when true', () => {
        ProjectService.isRepoAvailableTest('bower')
          .subscribe((isAvailable) => {
            isAvailable.should.be.eql(true);
            ProjectService.isRepoAvailable('bower').should.be.eql(true);
          });
      });

      it('when false', () => {
        ProjectService.setPath(`${process.cwd()}/test-project/empty`);
        ProjectService.isRepoAvailableTest('bower')
          .subscribeOnCompleted(()=> {
            ProjectService.isRepoAvailable('bower').should.be.eql(false);
          });
      });
    });

    describe('npm', () => {
      it('when true', () => {
        ProjectService.isRepoAvailableTest('npm')
          .subscribe((isAvailable) => {
            isAvailable.should.be.eql(true);
            ProjectService.isRepoAvailableTest('npm').should.be.eql(true);
          });
      });

      it('when false', () => {
        ProjectService.setPath(`${process.cwd()}/test-project/empty`);
        ProjectService.isRepoAvailableTest('npm')
          .subscribeOnCompleted(() => {
            ProjectService.isRepoAvailable('npm').should.be.eql(false);
          });
      });
    });
  });

  describe('getPackageJson - bower', () => {
    it('should return new object', () => {
      ProjectService.getPackageJson('bower').should.be.an.Object();
    });
  });

  describe('getPackageJson', () => {
    it('should return new object', () => {
      ProjectService.getPackageJson().should.be.an.Object();
    })
  });
});
