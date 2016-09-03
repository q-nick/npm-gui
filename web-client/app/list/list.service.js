(function() {
    'use strict';

    angular
        .module('npm-gui')
        .factory('ListService', ListService);

    function ListService(ListFactory, ModulesListFactory) {
        var modules = new ModulesListFactory('modules');
        var devModules = new ModulesListFactory('devModules');
        var globalModules = new ModulesListFactory('globalModules');
        var binModules = new ListFactory('binModules');
        var tasks = new ListFactory('tasks');

        return {
            modules: modules,
            devModules: devModules,
            globalModules: globalModules,
            binModules: binModules,
            tasks: tasks
        };
    }

})();
