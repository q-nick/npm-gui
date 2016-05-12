(function() {
    'use strict';

    angular
        .module('npm-gui')
        .factory('ModulesListFactory', ModulesListFactory);

    function ModulesListFactory(ListFactory, $http) {
        return factoryMethod;

        function factoryMethod(listName) {
            var listInstance = new ListFactory(listName, {
                afterGetSuccess: function() {
                    getVersions();
                    getNSP();
                }
            });

            function getVersions() {
                listInstance.list.versionsLoading = true;

                var req = {
                    method: 'GET',
                    url: '/' + listName + '/versions'
                };

                $http(req).success(onGetVersionsSuccess).error(onGetVersionsError);
            }

            function onGetVersionsSuccess(data) {
                for (var i = 0; i < listInstance.list.data.length; i++) {
                    var obj = listInstance.list.data[i];

                    if (data[obj.key]) {
                        obj.version = data[obj.key].version;
                        obj.wanted = data[obj.key].wanted;
                        obj.latest = data[obj.key].latest;
                    }
                }
                listInstance.list.versionsLoading = false;
            }

            function onGetVersionsError(data) {
                //console.log(data);
                console.log(data.length);
            }

            function getNSP() {
                listInstance.list.nspLoading = true;

                var req = {
                    method: 'GET',
                    url: '/' + listName + '/nsp'
                };

                $http(req).success(onGetNSPSuccess).error(onGetNSPError);
            }

            function onGetNSPSuccess(data) {
                for (var i = 0; i < listInstance.list.data.length; i++) {
                    var obj = listInstance.list.data[i];

                    if (data[obj.key]) {
                        obj.nsp = {
                            title: data[obj.key].title,
                            advisory: data[obj.key].advisory,
                            vulnerable_versions: data[obj.key].vulnerable_versions,
                            patched_version: data[obj.key].patched_version
                        };
                    }
                }
                listInstance.list.nspLoading = false;
            }

            function onGetNSPError(data) {
                //console.log(data);
                console.log(data.length);
            }

            return listInstance;
        }
    }

})();
