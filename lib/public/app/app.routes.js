(function() {
    'use strict';

    angular
        .module('npm-gui')
        .config(['$routeProvider', '$locationProvider',
            function($routeProvider, $locationProvider) {
                $routeProvider
                    .when('/modules', {
                        templateUrl: 'app/modules/index.modules.html',
                        controller: 'ModulesController',
                        controllerAs: 'modules'
                    })
                    .when('/devModules', {
                        templateUrl: 'app/devModules/index.devModules.html',
                        controller: 'DevModulesController',
                        controllerAs: 'devModules'
                    })
                    .when('/tasks', {
                        templateUrl: 'app/tasks/index.tasks.html',
                        controller: 'TasksController',
                        controllerAs: 'tasks'
                    })
                    .when('/builder', {
                        templateUrl: 'app/builder/index.builder.html',
                        controller: 'BuilderController',
                        controllerAs: 'builder'
                    })
                    .otherwise('/modules');

                $locationProvider.html5Mode(false);
            }]);

})();