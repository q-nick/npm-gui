(function() {
    'use strict';

    angular
        .module('npm-gui')
        .factory('ProjectService', ProjectService);

    function ProjectService($http) {
        var project = {
            data: {
                name: 'Unknown'
            },
            loading: false,
            error: false
        };

        loadInfo();

        return {
            getInfo: getInfo,
            loadInfo: loadInfo
        };

        function onLoadSuccess(data) {
            angular.copy(data, project.data);
        }

        function onLoadError() {
            project.error = true;
        }

        function loadInfo() {
            var req = {
                method: 'GET',
                url: '/project'
            };

            $http(req).success(onLoadSuccess.bind(this)).error(onLoadError.bind(this));
        }

        function getInfo() {
            return project;
        }
    }

})();
