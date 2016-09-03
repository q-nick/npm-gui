var helpers = require('./web-server/helpers/helpers.js');
helpers.setProjectPath(__dirname);

var ModulesService = require('./web-server/modules/modules/modules.service.js')

var Rx = require('rx');

console.log(ModulesService.getModules());


ModulesService.updateModulesInfo();
