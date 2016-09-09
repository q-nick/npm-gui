var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var rewire = require('rewire');
//promise stub
var sinonStubPromise = require('sinon-stub-promise');
sinonStubPromise(sinon);

//application:
var modulesController = rewire('./modules.controller');
var commands = rewire('../../helpers/commands');
var helpers = rewire('../../helpers/helpers');

//mocks
var packageResultsMock = require('../../test/packageJson.mock').resultsMock;
var res, req, output;
//
var isDevModules = true;


//objects mock
var PackageJsonMock = function () {
  return {
    getDependenciesArray: function () {
      return packageResultsMock.dependencies;
    },
    getDevDependenciesArray: function () {
      return packageResultsMock.devDependencies;
    }
  };
};

var HelpersMock = {
  isDevModules: function () {
    return isDevModules;
  },
  buildObjectFromArray: helpers.buildObjectFromArray,
  JSONparse: helpers.JSONparse
};

var CommandsMock = {
  run: function () {
  },
  runStubs: {},
  nsp: commands.nsp,
  npm: commands.npm
};

describe('Modules Controller', function () {
  before(function () {
    modulesController.__set__({
      'PackageJson': PackageJsonMock,
      'helpers': HelpersMock,
      'commands': CommandsMock
    });

    sinon.stub(CommandsMock, 'run', function (command) {
      return CommandsMock.runStubs[JSON.stringify(command)](arguments);
    });

    res = {
      setHeader: function () {
      },
      status: function () {
        return this;
      },
      send: function (out) {
        output = out;
      }
    };

    req = {
      originalUrl: '',
      body: {
        key: 'npm-gui'
      },
      params: {
        name: 'npm-gui',
        repo: 'npm'
      }
    };

    output = '';
  });

  describe("GET", function () {
    it('should return array of dependencies', function () {
      //preparation
      isDevModules = false;

      //execute
      modulesController.whenGet(req, res);

      //test
      expect(output[0]).to.deep.equal(packageResultsMock.dependencies[0]);
      expect(output[1]).to.deep.equal(packageResultsMock.dependencies[1]);
    });

    it('should return array of dev dependencies', function () {
      //preparation
      isDevModules = true;

      //execute
      modulesController.whenGet(req, res);

      //test
      expect(output[0]).to.deep.equal(packageResultsMock.devDependencies[0]);
      expect(output[1]).to.deep.equal(packageResultsMock.devDependencies[1]);
    });
  });

  describe("PUT", function () {
    it('should install regular dependency', function () {
      //preparation
      isDevModules = false;
      var installCommand = JSON.parse(JSON.stringify(commands.npm.install));
      installCommand.args.push('npm-gui');
      installCommand.args.push('-S');

      CommandsMock.runStubs[JSON.stringify(installCommand)] = sinon.stub().returnsPromise();
      CommandsMock.runStubs[JSON.stringify(installCommand)].resolves({});

      //execute
      modulesController.whenPut(req, res);

      //test
      expect(CommandsMock.run.calledWith(installCommand)).to.equal(true);
    });

    it('should install dev dependency', function () {
      //preparation
      isDevModules = true;
      var installCommand = JSON.parse(JSON.stringify(commands.npm.install));
      installCommand.args.push('npm-gui');
      installCommand.args.push('-D');

      CommandsMock.runStubs[JSON.stringify(installCommand)] = sinon.stub().returnsPromise();
      CommandsMock.runStubs[JSON.stringify(installCommand)].resolves({});

      //execute
      modulesController.whenPut(req, res);

      //test
      expect(CommandsMock.run.calledWith(installCommand)).to.equal(true);
    });
  });

  describe("DELETE", function () {
    it('should uninstall regular dependency', function () {
      //preparation
      isDevModules = false;
      var uninstallCommand = JSON.parse(JSON.stringify(commands.npm.uninstall));
      uninstallCommand.args.push('npm-gui');
      uninstallCommand.args.push('-S');

      CommandsMock.runStubs[JSON.stringify(uninstallCommand)] = sinon.stub().returnsPromise();
      CommandsMock.runStubs[JSON.stringify(uninstallCommand)].resolves({});

      //execute
      modulesController.whenDelete(req, res);

      //test
      expect(CommandsMock.run.calledWith(uninstallCommand)).to.equal(true);
    });

    it('should uninstall dev dependency', function () {
      //preparation
      isDevModules = true;
      var uninstallCommand = JSON.parse(JSON.stringify(commands.npm.uninstall));
      uninstallCommand.args.push('npm-gui');
      uninstallCommand.args.push('-D');

      CommandsMock.runStubs[JSON.stringify(uninstallCommand)] = sinon.stub().returnsPromise();
      CommandsMock.runStubs[JSON.stringify(uninstallCommand)].resolves({});

      //execute
      modulesController.whenDelete(req, res);

      //test
      expect(CommandsMock.run.calledWith(uninstallCommand)).to.equal(true);
    });
  });

  describe("NSP- GET", function () {
    it('should return insecure dependency from nsp command', function () {
      //preparation
      CommandsMock.runStubs[JSON.stringify(commands.nsp.check)] = sinon.stub().returnsPromise();
      CommandsMock.runStubs[JSON.stringify(commands.nsp.check)].resolves({
        stderr: '[{ "module": "angular" }, { "module": "tor" }]'
      });

      //execute
      modulesController.whenGetNSP(req, res);

      //test
      expect(CommandsMock.run.calledWith(commands.nsp.check)).to.equal(true);
      expect(output).to.deep.equal({
        angular: {
          module: "angular"
        },
        tor: {
          module: "tor"
        }
      });
    });
  });

  describe("Versions - GET", function () {
    it('should return full info about versions', function () {
      //preparation
      CommandsMock.runStubs[JSON.stringify(commands.npm.ls)] = sinon.stub().returnsPromise();
      CommandsMock.runStubs[JSON.stringify(commands.npm.ls)].resolves({
        stdout: '{' +
        '   "name": "npm-gui",' +
        '   "version": "x.x.x",' +
        '   "dependencies": {' +
        '       "angular": {' +
        '           "version": "2.4.0"' +
        '       }' +
        '   }' +
        '}'
      });
      CommandsMock.runStubs[JSON.stringify(commands.npm.outdated)] = sinon.stub().returnsPromise();
      CommandsMock.runStubs[JSON.stringify(commands.npm.outdated)].resolves({
        stdout: '{' +
        '   "angular": {' +
        '       "current": "2.4.0",' +
        '       "wanted": "2.4.5",' +
        '       "latest": "3.0.1",' +
        '       "location": "node_modules/angular"' +
        '   }' +
        '}'
      });

      //execute
      modulesController.whenGetVersions(req, res);

      //test
      expect(CommandsMock.run.calledWith(commands.npm.ls)).to.equal(true);
      expect(CommandsMock.run.calledWith(commands.npm.outdated)).to.equal(true);
      expect(output).to.deep.equal({
        angular: {
          version: '2.4.0',
          wanted: '2.4.5',
          latest: '3.0.1',
        }
      });
    });
  });
});
