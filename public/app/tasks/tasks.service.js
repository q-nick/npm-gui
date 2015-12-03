(function() {
    'use strict';

    angular
        .module('kufa')
        .factory('TasksService', TasksService);

    function TasksService($http) {
        var tasks = {
            loading: false,
            error: false,
            data: [],
            clearFlags: function() {
                this.loading = false;
                this.error = false;
            }
        };

        return {
            getTasks: getTasks,
            addTask: addTask,
            removeTask: removeTask,
            runTask: runTask
        };

        function getTasks() {
            tasks.clearFlags();
            tasks.loading = true;

            var req = {
                method: 'GET',
                url: '/tasks'
            };

            $http(req).success(onGetTasksSuccess).error(onGetTasksError);

            return tasks;
        }

        function onGetTasksSuccess(data) {
            angular.copy(data, tasks.data);
            tasks.clearFlags();
        }

        function onGetTasksError() {
            tasks.clearFlags();
            tasks.error = true;
        }

        function addTask(name, command) {
            var req = {
                method: 'PUT',
                url: '/tasks',
                data: {
                    name: name,
                    command: command
                }
            };

            //it should be promise? or maybe console should work on websocket?
            $http(req);//.success(onGetTasksSuccess).error(onGetTasksError);
        }

        function removeTask(name) {
            var req = {
                method: 'DELETE',
                url: '/tasks/' + name
            };

            //it should be promise? or maybe console should work on websocket?
            $http(req);//.success(onGetTasksSuccess).error(onGetTasksError);
        }

        function runTask(name) {
            var req = {
                method: 'POST',
                url: '/tasks/' + name
            };

            //it should be promise? or maybe console should work on websocket?
            $http(req);//.success(onGetTasksSuccess).error(onGetTasksError);
        }
    }

})();
