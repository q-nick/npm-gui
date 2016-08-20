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
        vm.updateAll = updateAll;
        vm.removeExtraneous = removeExtraneous;
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

        function removeExtraneous() {
            //vm.list = modules.get();
            console.log('EXTRANEOUS');
        }

        function updateAll(versions) {
            var anyUpdated = false;
            for (var i = 0; i < vm.list.data.length; i++) {
                if (vm.list.data[i][versions]) {
                    anyUpdated = true;
                    updateModule(vm.list.data[i], vm.list.data[i][versions]);
                }
            }

            //fallback for now
            if (!anyUpdated) {
                alert('None updated :(');
            }
        }
    }

})();
