(function() {
    'use strict';

    angular
        .module('npm-gui')
        .controller('ModulesController', ModulesController);

    function ModulesController(modules) {
        var vm = this;

        loadModules();

        vm.addModule = addModule;
        vm.removeModule = removeModule;
        vm.loadModules = loadModules;
        vm.reinstallModules = reinstallModules;

        function addModule() {
            modules.add(vm.newModuleName, vm.newModuleVersion);
            vm.newModuleName = '';
            vm.newModuleVersion = '';
        }

        function removeModule(module) {
            modules.remove(module.key);
        }

        function loadModules() {
            vm.list = modules.get();
        }

        function reinstallModules() {
            vm.list = modules.get();
        }
    }

})();
