(function() {
    'use strict';

    angular
        .module('npm-gui')
        .factory('ListService', ListService);

    function ListService(ListFactory, ModulesListFactory) {
        var dependencies = new ModulesListFactory('dependencies');
        var dependenciesDev = new ModulesListFactory('dependenciesDev');
        var globalPackages = new ModulesListFactory('globalPackages');
        var dependenciesBin = new ListFactory('dependenciesBin');
        var tasks = new ListFactory('tasks');

        return {
            dependencies: dependencies,
            dependenciesDev: dependenciesDev,
            globalPackages: globalPackages,
            dependenciesBin: dependenciesBin,
            tasks: tasks
        };
    }

})();
