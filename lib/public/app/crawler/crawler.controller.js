(function() {
    'use strict';

    angular
        .module('npm-gui')
        .controller('CrawlerController', CrawlerController);

    function CrawlerController(CrawlerService, $uibModalInstance) {
        var vm = this;
        vm.files = [];
        vm.currentPath = '';

        vm.loadNewPath = loadNewPath;

        loadNewPath('');

        function loadNewPath(affix) {
            CrawlerService
                .showPath(vm.currentPath + '/' + affix)
                .success(function(data) {
                    vm.currentPath = vm.currentPath + '/' + affix;
                    angular.copy(data, vm.files);
                    vm.files.unshift('..');
                });
        }


        vm.ok = function() {
            $uibModalInstance.close(vm.currentPath);
        };

        vm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }

})();
