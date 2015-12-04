(function() {
    'use strict';

    angular
        .module('kufa')
        .factory('ListFactory', ListFactory);

    function ListFactory($http) {
        return factoryMethod;

        function factoryMethod(listName) {
            var list = {
                loading: false,
                error: false,
                data: [],
                clearFlags: function() {
                    this.loading = false;
                    this.error = false;
                }
            };

            return {
                get: get,
                add: add,
                remove: remove
            };

            function get() {
                list.clearFlags();
                list.loading = true;

                var req = {
                    method: 'GET',
                    url: '/' + listName
                };

                $http(req).success(onGetSuccess).error(onGetError);

                return list;
            }

            function onGetSuccess(data) {
                angular.copy(data, list.data);
                list.clearFlags();
            }

            function onGetError() {
                list.clearFlags();
                list.error = true;
            }

            function add(key, value) {
                var req = {
                    method: 'PUT',
                    url: '/' + listName,
                    data: {
                        key: key,
                        value: value
                    }
                };

                //it should be promise? or maybe console should work on websocket?
                $http(req);//.success(onGetModulesSuccess).error(onGetModulesError);
            }

            function remove(key) {
                var req = {
                    method: 'DELETE',
                    url: '/' + listName + '/' + key
                };

                //it should be promise? or maybe console should work on websocket?
                $http(req);//.success(onGetModulesSuccess).error(onGetModulesError);
            }
        }
    }

})();
