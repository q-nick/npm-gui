(function() {
    'use strict';

    angular.module('npm-gui', [
        'ngAnimate',
        'ngRoute',
        'ui.bootstrap'
    ]).run(function(ProjectService, ConsoleService, $route) {
        ProjectService.onProjectChange(function() {
            ConsoleService.clearLog();
            $route.reload();
        });
    });

})();
