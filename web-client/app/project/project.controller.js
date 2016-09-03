(function() {
    'use strict';

    angular
        .module('npm-gui')
        .controller('ProjectController', ProjectController);

    function ProjectController(ProjectService, CrawlerService, $uibModalInstance) {
        var vm = this;

        vm.files = [];
        vm.projectPath = ProjectService.getInfo().data.projectPath;
        vm.loadNewPath = loadNewPath;
        vm.packageJsonFound = false;

        loadNewPath('');

        function loadNewPath(affix) {
            CrawlerService
                .showPath(vm.projectPath, affix)
                .success(function(data) {
                    vm.projectPath = data.path;
                    angular.copy(data.files, vm.files);
                    vm.files.unshift({
                        directory: true,
                        name: '..'
                    });

                    var containPackageJson = false;
                    vm.files.find(function(file) {
                        if (file.name === 'package.json') {
                            containPackageJson = true;
                        }
                    });
                    vm.packageJsonFound = containPackageJson;
                })
                .error(function() {
                    angular.copy([], vm.files);
                });
        }

        vm.ok = function() {
            ProjectService.setPath(vm.projectPath);
            $uibModalInstance.close();
        };

        vm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }

})();
