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
var PackageJsonMock = function() {
    return {
        getDependenciesArray: function() {
            return packageResultsMock.dependencies;
        },
        getDevDependenciesArray: function() {
            return packageResultsMock.devDependencies;
        }
    };
};

var HelpersMock = {
    isDevModules: function() {
        return isDevModules;
    },
    buildObjectFromArray: helpers.buildObjectFromArray
};

var CommandsMock = {
    run: null,
    nsp: commands.nsp
};

describe('Modules Controller', function() {
    before(function() {
        modulesController.__set__({
            'PackageJson': PackageJsonMock,
            'helpers': HelpersMock,
            'commands': CommandsMock
        });

        CommandsMock.run = sinon.stub().returnsPromise();

        res = {
            setHeader: function() {},
            status: function() {
                return this;
            },
            send: function(out) {
                output = out;
            }
        };

        req = {
            originalUrl: ''
        };

        output = '';
    });

    describe("GET", function() {
        it('should return array of dependencies', function() {
            //preparation
            isDevModules = false;

            //execute
            modulesController.whenGet(req, res);
            output = JSON.parse(output);

            //test
            expect(output[0]).to.deep.equal(packageResultsMock.dependencies[0]);
            expect(output[1]).to.deep.equal(packageResultsMock.dependencies[1]);
        });

        it('should return array of dev dependencies', function() {
            //preparation
            isDevModules = true;

            //execute
            modulesController.whenGet(req, res);
            output = JSON.parse(output);

            //test
            expect(output[0]).to.deep.equal(packageResultsMock.devDependencies[0]);
            expect(output[1]).to.deep.equal(packageResultsMock.devDependencies[1]);
        });
    });

    describe("PUT", function() {

    });

    describe("DELETE", function() {

    });

    describe("POST", function() {

    });

    describe("NSP- GET", function() {
        it('should return insecure dependency from nsp command', function() {
            //preparation
            CommandsMock.run.resolves({
                stderr: '[{ "module": "angular" }, { "module": "tor" }]'
            });

            //execute
            modulesController.whenGetNSP(req, res);
            //output = JSON.parse(output);

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
});
