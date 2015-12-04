(function() {
    'use strict';

    angular
        .module('kufa')
        .config(['$routeProvider', '$locationProvider',
            function($routeProvider, $locationProvider) {
                $routeProvider
                    .when('/modules', {
                        templateUrl: 'app/modules/index.modules.html',
                        controller: 'ModulesController',
                        controllerAs: 'modules'
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