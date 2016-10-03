const updateAllDependencies
  = require('./dependencies.updateAll.service.js').updateAllDependencies;

const reinstallAllDependencies
  = require('./dependencies.reinstall.service.js').reinstallAllDependencies;

const dedupe = require('./dependencies.dedupe.service.js').dedupe;
const prune = require('./dependencies.prune.service.js').prune;
const shrinkwrap = require('./dependencies.shrinkwrap.service.js').shrinkwrap;
const get = require('./dependencies.service.js').get;

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

module.exports.get = get;
module.exports.reinstallAllDependencies = reinstallAllDependencies;
module.exports.dedupe = dedupe;
module.exports.shrinkwrap = shrinkwrap;
module.exports.prune = prune;
module.exports.updateAllDependencies = updateAllDependencies;
