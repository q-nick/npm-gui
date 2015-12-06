(function() {
    'use strict';

    angular
        .module('npm-gui')
        .controller('ModulesController', ModulesController);

    function ModulesController(ListService) {
        var vm = this;

        loadModules();

        vm.addModule = addModule;
        vm.removeModule = removeModule;
        vm.loadModules = loadModules;

        function addModule() {
            ListService.modules.add(vm.newModuleName, vm.newModuleVersion);
            vm.newModuleName = '';
            vm.newModuleVersion = '';
        }

        function removeModule(module) {
            ListService.modules.remove(module.key);
        }

        function loadModules() {
            vm.list = ListService.modules.get();
        }
    }

})();
