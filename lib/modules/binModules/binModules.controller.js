var helpers = require('../../helpers/helpers.js');
var PackageJson = require('../../helpers/packageJson.js').PackageJson;

function whenGet(req, res) {
    var indexPackageJson = new PackageJson();
    var allDevDependenciesArray = indexPackageJson.getDevDependenciesArray();
    var preparedBinDependenciesArray = [];

    for (var i = 0; i < allDevDependenciesArray.length; i++) {
        var localPath = './node_modules/' + allDevDependenciesArray[i].key;
        var packageJson = new PackageJson(localPath + '/package.json');
        if (packageJson.getBin()) {
            preparedBinDependenciesArray.push(allDevDependenciesArray[i]);
        }
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(preparedBinDependenciesArray, null, 2));
}

module.exports.whenGet = whenGet;