var helpers = require('./lib/helpers/helpers.js');
helpers.setProjectPath(__dirname);

var ModulesService = require('./lib/modules/modules/modules.service.js')

var Rx = require('rx');

console.log(ModulesService.getModules());


ModulesService.updateModulesInfo();
