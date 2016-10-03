const Rx = require('rx');
const CommandsService = require('../../service/commands/commands.service.js');
const UtilsService = require('../../service/utils/utils.service.js');
const ProjectService = require('../../service/project/project.service.js');

function checkVersionBower(dependencies) {
  return Rx.Observable.create((observer) => {
    CommandsService.run(CommandsService.cmd.bower.ls)
      .subscribe((data) => {
        const dependenciesListed = UtilsService.parseJSON(data.stdout).dependencies;
        Object.keys(dependenciesListed).forEach((key) => {
          const dependency = dependenciesListed[key];
          if (dependency.pkgMeta) {
            UtilsService.setInArrayByRepoAndKey('bower',
              'key', key,
              'version', dependency.pkgMeta.version,
              dependencies);

            if (dependency.update.target !== dependency.pkgMeta.version) {
              UtilsService.setInArrayByRepoAndKey('bower',
                'key', key,
                'wanted', dependency.update.target,
                dependencies);
            }
            if (dependency.update.latest !== dependency.pkgMeta.version) {
              UtilsService.setInArrayByRepoAndKey('bower',
                'key', key,
                'latest', dependency.update.latest,
                dependencies);
            }
          }
        });
        observer.onNext(dependencies);
        observer.onCompleted();
      });
  });
}

function checkVersionNPM(dependencies) {
  return Rx.Observable.create((observer) => {
    const lsSource = CommandsService.run(CommandsService.cmd.npm.ls).share();
    const outdatedSource = CommandsService.run(CommandsService.cmd.npm.outdated).share();

    const bothSource = Rx.Observable.concat(lsSource, outdatedSource);

    lsSource
      .subscribe((data) => {
        // ls command result
        const dependenciesListed = UtilsService.parseJSON(data.stdout).dependencies;

        Object.keys(dependenciesListed).forEach((key) => {
          const dependency = dependenciesListed[key];
          UtilsService.setInArrayByRepoAndKey('npm',
            'key', key,
            'version', dependency.version,
            dependencies);
        });
      });

    outdatedSource
      .subscribe((data) => {
        // outdated command result
        const dependenciesOutdated = UtilsService.parseJSON(data.stdout);

        Object.keys(dependenciesOutdated).forEach((key) => {
          const dependency = dependenciesOutdated[key];
          if (dependency.wanted !== dependency.current) {
            UtilsService.setInArrayByRepoAndKey('npm',
              'key', key,
              'wanted', dependency.wanted,
              dependencies);
          }
          if (dependency.latest !== dependency.current) {
            UtilsService.setInArrayByRepoAndKey('npm',
              'key', key,
              'latest', dependency.latest,
              dependencies);
          }
        });
      });

    bothSource
      .subscribeOnCompleted(() => {
        observer.onNext(dependencies);
        observer.onCompleted();
      });
  });
}

function updateDependenciesInfo(repo, isDev) {
  return Rx.Observable.create((observer) => {
    const packageJson = ProjectService.getPackageJson(repo);

    const dependencies = isDev ?
      packageJson.getDevDependenciesArrayAs(repo)
      :
      packageJson.getDependenciesArrayAs(repo);

    // check versions
    if (repo === 'bower') {
      checkVersionBower(dependencies)
        .subscribe(() => {
          observer.onNext(dependencies);
          observer.onCompleted();
        });
    } else {
      checkVersionNPM(dependencies)
        .subscribe(() => {
          observer.onNext(dependencies);
          observer.onCompleted();
        });
    }
  });
}

function updateRepo(repo) {
  return Rx.Observable.create((observer) => {
    if (!ProjectService.isRepoAvailable(repo)) {
      observer.onNext();
      observer.onCompleted();
      return;
    }

    const sourceRegular = updateDependenciesInfo(repo, false).share();
    const sourceDev = updateDependenciesInfo(repo, true).share();


    const source = sourceRegular.merge(sourceDev);

    sourceRegular
      .subscribe((data) => {
        ProjectService.dependencies.all = ProjectService.dependencies.all.concat(data);
      });

    sourceDev
      .subscribe((data) => {
        ProjectService.devDependencies.all = ProjectService.devDependencies.all.concat(data);
      });

    source
      .subscribeOnCompleted(() => {
        observer.onNext();
        observer.onCompleted();
      });
  });
}

function updateModulesInfo() {
  return Rx.Observable.create((observer) => {
    ProjectService.checkReposAvailability()
      .subscribe(() => {
        // repos availability completed
        // clear arrays
        ProjectService.dependencies.all = [];
        ProjectService.devDependencies.all = [];
        // update all repos
        const sourceNPM = updateRepo('npm');
        const sourceBower = updateRepo('bower');

        const sourceBoth = sourceNPM.merge(sourceBower);

        sourceBoth
          .subscribeOnCompleted(() => {
            ProjectService.dependencies.lastId = true;
            ProjectService.devDependencies.lastId = true;
            observer.onNext();
            observer.onCompleted();
          });
      });
  });
}

// ///////////////////////////////////////////////////////////////////////////////

module.exports = {
  get(isDev) {
    return Rx.Observable.create((observer) => {
      if (ProjectService.dependencies.lastId && ProjectService.devDependencies.lastId) {
        observer.onNext(isDev ?
          ProjectService.devDependencies.all : ProjectService.dependencies.all);
        observer.onCompleted();
      } else {
        updateModulesInfo()
          .subscribe(() => {
            observer.onNext(isDev ?
              ProjectService.devDependencies.all : ProjectService.dependencies.all);
            observer.onCompleted();
          });
      }
    });
  },
};
