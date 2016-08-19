(function() {
    'use strict';

    angular
        .module('npm-gui')
        .factory('CrawlerService', CrawlerService);

    function CrawlerService($http) {
        return {
            showPath: showPath
        };

        function showPath(path, affix) {
            //build path which will be shown
            var pathToShow = path.replace(/\/$/, '');
            if (affix === '..') {
                //for up directory exception
                pathToShow = pathToShow.split('/').reverse();
                pathToShow.shift();
                pathToShow = pathToShow.reverse().join('/').replace(/\/$/, '');
            } else {
                //regular folder
                pathToShow += '/' + affix;
            }

            var req = {
                method: 'GET',
                url: '/crawler/' + encodeURIComponent(pathToShow)
            };

            return $http(req);
        }
    }

})();
