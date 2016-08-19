(function() {
    'use strict';

    angular
        .module('npm-gui')
        .controller('ModulesController', ModulesController);

    function ModulesController(modules) {
        var vm = this;

        loadModules();

        vm.addModule = addModule;
        vm.updateModule = updateModule;
        vm.removeModule = removeModule;
        vm.loadModules = loadModules;
        vm.reinstallModules = reinstallModules;
        vm.newModuleRepo = 'npm';

        function addModule() {
            modules.add(vm.newModuleName, vm.newModuleVersion, vm.newModuleRepo);
            vm.newModuleName = '';
            vm.newModuleVersion = '';
        }

        function updateModule(moduleToUpdate, version) {
            modules.add(moduleToUpdate.key, version, moduleToUpdate.repo);
        }

        function removeModule(moduleToRemove) {
            modules.remove(moduleToRemove.key, moduleToRemove.repo);
        }

        function loadModules() {
            vm.list = modules.get();
        }

        function reinstallModules() {
            vm.list = modules.get();
        }
    }

})();
