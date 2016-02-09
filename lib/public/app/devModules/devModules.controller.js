(function() {
    'use strict';

    angular
        .module('npm-gui')
        .controller('DevModulesController', DevModulesController);

    function DevModulesController(ListService) {
        var vm = this;

        loadModules();

        vm.addModule = addModule;
        vm.removeModule = removeModule;
        vm.loadModules = loadModules;

        function addModule() {
            console.log(vm);
            ListService.devModules.add(vm.newModuleName, vm.newModuleVersion);
            vm.newModuleName = '';
            vm.newModuleVersion = '';
        }

        function removeModule(module) {
            ListService.devModules.remove(module.key);
        }

        function loadModules() {
            vm.list = ListService.devModules.get();
        }
    }

})();
