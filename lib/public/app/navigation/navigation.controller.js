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
                templateUrl: 'app/crawler/crawler.html',
                controller: 'CrawlerController',
                controllerAs: 'crawler'
            });

            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }
    }

})();
