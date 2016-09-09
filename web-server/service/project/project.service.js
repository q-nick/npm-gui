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

  getBowerJson() {
    return new PackageJson(this.getPath(), 'bower.json');
  },

  getPackageJson() {
    return new PackageJson(this.getPath());
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
};
