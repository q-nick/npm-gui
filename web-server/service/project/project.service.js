const Rx = require('rx');
const fs = require('fs');
const PackageJson = require('../../model/package-json.js');

let projectPath = process.cwd();

const isRepoAvailable = {
  npm: false,
  bower: false,
};

module.exports = {
  isRepoAvailable(repo) {
    return isRepoAvailable[repo];
  },

  getPath() {
    return projectPath;
  },

  setPath(newProjectPath) {
    projectPath = newProjectPath;
  },

  isRepoAvailableTest(repo) {
    const fileToTest = repo === 'bower' ? 'bower.json' : 'package.json';
    return Rx.Observable.create((observer) => {
      fs.access(`${this.getPath()}/${fileToTest}`, (err) => {
        if (!err) {
          observer.onNext(true);
        } else {
          observer.onError(false);
        }
        observer.onCompleted();
      });
    });
  },

  getPackageJson(repo) {
    return new PackageJson(this.getPath(), (repo === 'npm' ? 'package' : repo));
  },

  checkReposAvailability() {
    return Rx.Observable.create((observer) => {
      const sourceBower = this.isRepoAvailableTest('bower');
      sourceBower
        .subscribe(() => {
          isRepoAvailable.bower = true;
        }, () => {
          isRepoAvailable.bower = false;
        });

      const sourceNPM = this.isRepoAvailableTest('npm');
      sourceNPM
        .subscribe(() => {
          isRepoAvailable.npm = true;
        }, () => {
          isRepoAvailable.npm = false;
        });

      const source = sourceBower.merge(sourceNPM);

      source.subscribeOnCompleted(() => {
        observer.onNext();
        observer.onCompleted();
      });
    });
  },

  // or private? TODO test
  dependencies: {
    lastId: null,
    all: {},
  },

  devDependencies: {
    lastId: null,
    all: [],
  },
};
