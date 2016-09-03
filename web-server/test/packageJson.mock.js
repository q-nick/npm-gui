'use strict';
var helpers = require('../helpers/helpers');

var packageMock = {
    "dependencies": {
        "angular": "^1.4.8",
        "angular-animate": "^1.4.8"
    },
    "devDependencies": {
        "chai": "^3.4.1",
        "mocha": "^2.3.4"
    },
    "scripts": {
        "start": "./bin/npm-gui",
        "test": "./node_modules/mocha/bin/mocha ./lib/modules/**/*.js"
    },
    "bin": "anynameofbin.js"
};

//how it look when return by packageJson
var resultsPackageMock = {
    dependencies: [],
    devDependencies: [],
    scripts: []
};

helpers.buildArrayFromObject(packageMock.dependencies, resultsPackageMock.dependencies, 'key', 'value');
helpers.buildArrayFromObject(packageMock.devDependencies, resultsPackageMock.devDependencies, 'key', 'value');
helpers.buildArrayFromObject(packageMock.scripts, resultsPackageMock.scripts, 'key', 'value');


module.exports.mock = packageMock;
module.exports.resultsMock = resultsPackageMock;
