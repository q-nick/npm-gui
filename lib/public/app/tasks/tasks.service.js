(function() {
    'use strict';

    angular
        .module('npm-gui')
        .factory('TasksService', TasksService);

    function TasksService($http) {

        return {
            run: run
        };

        function run(name) {
            var req = {
                method: 'POST',
                url: '/tasks/' + name
            };

            //it should be promise? or maybe console should work on websocket?
            $http(req);//.success(onGetTasksSuccess).error(onGetTasksError);
        }
    }

})();
