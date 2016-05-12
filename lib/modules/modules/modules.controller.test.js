var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var rewire = require('rewire');

var modulesController = rewire('./modules.controller');

var PackageJsonMock = function() {
    console.log('wtf');
};

describe('Modules Controller', function() {
    before(function() {
        modulesController.__set__({
            'PackageJson': PackageJsonMock
        });
    });

    describe("GET", function() {
        var output = null;

        var res = {
            setHeader: function() {},
            status: function() {
                return this;
            },
            send: function(out) {
                output = out;
            }
        };

        var req = {
            originalUrl: ''
        };

        modulesController.whenGet(req, res);
    });

    describe("PUT", function() {

    });

    describe("DELETE", function() {

    });

    describe("POST", function() {

    });
});
