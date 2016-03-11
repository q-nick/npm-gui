(function() {
    'use strict';

    angular
        .module('npm-gui')
        .factory('ListService', ListService);

    function ListService(ListFactory) {
        var modules = new ListFactory('modules');
        var devModules = new ListFactory('devModules');
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
