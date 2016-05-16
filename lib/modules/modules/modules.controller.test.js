var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var rewire = require('rewire');


//mocks
var modulesController = rewire('./modules.controller');
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
    }
};

describe('Modules Controller', function() {
    before(function() {
        modulesController.__set__({
            'PackageJson': PackageJsonMock,
            'helpers': HelpersMock
        });

        output = null;

        res = {
            setHeader: function() {
            },
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
});
