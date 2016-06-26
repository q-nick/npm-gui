(function() {
    'use strict';

    angular
        .module('npm-gui')
        .factory('CrawlerService', CrawlerService);

    function CrawlerService($http) {
        return {
            showPath: showPath
        };

        function showPath(path) {
            var req = {
                method: 'GET',
                url: '/crawler/' + encodeURIComponent(path)
            };

            return $http(req);
        }
    }

})();
