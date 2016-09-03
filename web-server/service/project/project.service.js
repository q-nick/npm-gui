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

  isBowerAvailable() {
    return Rx.Observable.create((observer) => {
      fs.access(`${this.getPath()}/bower.json`, (err) => {
        if (!err) {
          observer.onNext();
        } else {
          observer.onError();
        }
        observer.onCompleted();
      });
    });
  },

  isNPMAvailable() {
    return Rx.Observable.create((observer) => {
      fs.access(`${this.getPath()}/package.json`, (err) => {
        if (!err) {
          observer.onNext();
        } else {
          observer.onError();
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
      const sourceBower = this.isBowerAvailable();
      sourceBower
        .subscribe(() => {
          isRepoAvailable.bower = true;
        }, () => {
          isRepoAvailable.bower = false;
        });

      const sourceNPM = this.isNPMAvailable();
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
