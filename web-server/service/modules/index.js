var updateModules = require('./modules.updateAll.service');
var reinstallModules = require('./modules.reinstall.service');
var dedupeModules = require('./modules.dedupe.service');
var pruneModules = require('./modules.prune.service');
var shrinkwrapModules = require('./modules.shrinkwrap.service');
var getModules = require('./modules.service');

/////////////////////
module.exports = function ModuleService() {
  this.isRepoAvailable = {
    npm: true,
    bower: true
  };

  this.modules = {
    lastId: null,
    all: {}
  };

  this.devModules = {
    lastId: null,
    all: {}
  };
};

module.exports.getModules = getModules;
module.exports.reinstallModules = reinstallModules;
module.exports.dedupeModules = dedupeModules;
module.exports.shrinkwrapModules = shrinkwrapModules;
module.exports.pruneModules = pruneModules;
module.exports.updateModules = updateModules;
