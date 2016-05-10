(function() {
    'use strict';

    angular
        .module('npm-gui')
        .factory('ListService', ListService);

    function ListService(ListFactory, ModulesListFactory) {
        var modules = new ModulesListFactory('modules');
        var devModules = new ModulesListFactory('devModules');
        var binModules = new ListFactory('binModules');
        var tasks = new ListFactory('tasks');

        return {
            modules: modules,
            devModules: devModules,
            binModules: binModules,
            tasks: tasks
        };
    }

})();
