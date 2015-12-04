(function() {
    'use strict';

    angular
        .module('kufa')
        .factory('ListService', ListService);

    function ListService(ListFactory) {
        var modules = new ListFactory('modules');
        var tasks = new ListFactory('tasks');

        return {
            modules: modules,
            tasks: tasks
        };
    }

})();
