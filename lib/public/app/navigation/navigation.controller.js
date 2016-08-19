(function() {
    'use strict';

    angular
        .module('npm-gui')
        .controller('NavigationController', NavigationController);

    function NavigationController(ProjectService, $uibModal) {
        var vm = this;
        vm.theme = 'sandstone';
        vm.project = ProjectService.getInfo();

        vm.openProject = openProject;

        function openProject() {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/project/project.html',
                controller: 'ProjectController',
                controllerAs: '$ctrl'
            });
        }
    }

})();
