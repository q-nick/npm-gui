(function() {
    'use strict';

    angular
        .module('npm-gui')
        .config(['$routeProvider', '$locationProvider',
            function($routeProvider, $locationProvider, ListService) {
                $routeProvider
                    .when('/modules', {
                        templateUrl: 'app/modules/index.modules.html',
                        controller: 'ModulesController',
                        controllerAs: 'modules',
                        resolve: {
                            modules: ['ListService', function(ListService) {
                                return ListService.modules;
                            }]
                        }
                    })
                    .when('/devModules', {
                        templateUrl: 'app/modules/index.modules.html',
                        controller: 'ModulesController',
                        controllerAs: 'modules',
                        resolve: {
                            modules: ['ListService', function(ListService) {
                                return ListService.devModules;
                            }]
                        }
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