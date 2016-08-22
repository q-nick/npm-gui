(function() {
    'use strict';

    angular
        .module('npm-gui')
        .factory('ListFactory', ListFactory);

    function ListFactory($http) {
        return factoryMethod;

        function factoryMethod(listName, additional) {
            var list = {
                loading: true,
                error: false,
                nspLoading: true,
                data: [],
                clearFlags: function() {
                    this.loading = false;
                    this.error = false;
                }
            };

            return {
                get: get,
                add: add,
                remove: remove,
                list: list
            };

            function get() {
                list.clearFlags();
                list.loading = true;

                var req = {
                    method: 'GET',
                    url: '/' + listName
                };

                $http(req).success(onGetSuccess.bind(this)).error(onGetError.bind(this));

                return list;
            }

            function onGetSuccess(data) {
                angular.copy(data, list.data);
                list.clearFlags();
                if (additional.afterGetSuccess) additional.afterGetSuccess();
            }

            function onGetError() {
                list.clearFlags();
                list.error = true;
            }

            function add(key, value, repo) {
                var req = {
                    method: 'PUT',
                    url: '/' + listName + '/' + repo,
                    data: {
                        key: key,
                        value: value
                    }
                };

                //it should be promise? or maybe console should work on websocket?
                $http(req).success(get); //.success(onGetModulesSuccess).error(onGetModulesError);
            }

            function remove(key, repo) {
                var req = {
                    method: 'DELETE',
                    url: '/' + listName + '/' + repo + '/' + key
                };

                //it should be promise? or maybe console should work on websocket?
                $http(req).success(get); //.success(onGetModulesSuccess).error(onGetModulesError);
            }
        }
    }

})();
