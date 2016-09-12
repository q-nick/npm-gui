const updateModules = require('./dependencies.updateAll.service.js');
const reinstallModules = require('./dependencies.reinstall.service.js');
const dedupeModules = require('./dependencies.dedupe.service.js');
const pruneModules = require('./dependencies.prune.service.js');
const shrinkwrapModules = require('./dependencies.shrinkwrap.service.js');
const getModules = require('./dependencies.service.js');

// ///////////////////
module.exports = function ModuleService() {
  this.modules = {
    lastId: null,
    all: {},
  };

  this.devModules = {
    lastId: null,
    all: {},
  };
};

module.exports.getModules = getModules;
module.exports.reinstallModules = reinstallModules;
module.exports.dedupeModules = dedupeModules;
module.exports.shrinkwrapModules = shrinkwrapModules;
module.exports.pruneModules = pruneModules;
module.exports.updateModules = updateModules;
