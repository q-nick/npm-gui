(function() {
    'use strict';

    angular
        .module('kufa')
        .factory('ModulesService', ModulesService);

    function ModulesService($http) {
        var modules = {
            loading: false,
            error: false,
            data: [],
            clearFlags: function() {
                this.loading = false;
                this.error = false;
            }
        };

        return {
            getModules: getModules,
            addModule: addModule,
            removeModule: removeModule
        };

        function getModules() {
            modules.clearFlags();
            modules.loading = true;

            var req = {
                method: 'GET',
                url: '/modules'
            };

            $http(req).success(onGetModulesSuccess).error(onGetModulesError);

            return modules;
        }

        function onGetModulesSuccess(data) {
            angular.copy(data, modules.data);
            modules.clearFlags();
        }

        function onGetModulesError() {
            modules.clearFlags();
            modules.error = true;
        }

        function addModule(name, version) {
            var req = {
                method: 'PUT',
                url: '/modules',
                data: {
                    name: name,
                    version: version
                }
            };

            //it should be promise? or maybe console should work on websocket?
            $http(req);//.success(onGetModulesSuccess).error(onGetModulesError);
        }

        function removeModule(name) {
            var req = {
                method: 'DELETE',
                url: '/modules/' + name
            };

            //it should be promise? or maybe console should work on websocket?
            $http(req);//.success(onGetModulesSuccess).error(onGetModulesError);
        }

    }

})();
