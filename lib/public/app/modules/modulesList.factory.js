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
                    getNSP();
                }
            });

            listInstance.updateAll = updateAll;

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
                console.log(data);
            }

            function updateAll(type) {
                listInstance.list.versionsLoading = true;

                var req = {
                    method: 'POST',
                    url: '/' + listName + '/updateAll',
                    data: {
                        type: type
                    }
                };

                //it will return new versions object
                $http(req).success(function(){
                    listInstance.get();
                }).error(onPostUpdateAllError);
            }

            function onPostUpdateAllError(data) {
                console.log(data);
            }

            return listInstance;
        }
    }

})();
