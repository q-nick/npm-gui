(function() {
    'use strict';

    angular
        .module('kufa')
        .controller('ModulesController', ModulesController);

    function ModulesController(ModulesService) {
        var vm = this;

        loadModules();

        vm.addModule = addModule;
        vm.removeModule = removeModule;
        vm.loadModules = loadModules;

        function addModule() {
            ModulesService.addModule(vm.newModuleName, vm.newModuleVersion);
            vm.newModuleName = '';
            vm.newModuleVersion = '';
        }

        function removeModule(module) {
            ModulesService.removeModule(module.name);
        }

        function loadModules() {
            vm.list = ModulesService.getModules();
        }
    }

})();
