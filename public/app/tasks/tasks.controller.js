(function() {
    'use strict';

    angular
        .module('kufa')
        .controller('TasksController', TasksController);

    function TasksController(TasksService) {
        var vm = this;

        loadTasks();

        vm.addTask = addTask;
        vm.removeTask = removeTask;
        vm.runTask = runTask;
        vm.loadTasks = loadTasks;

        function addTask() {
            TasksService.addTask(vm.newTaskName, vm.newTaskCommand);
            vm.newTaskName = '';
            vm.newTaskCommand = '';
        }

        function removeTask(task) {
            TasksService.removeTask(task.name);
        }

        function runTask(task) {
            TasksService.runTask(task.name);
        }

        function loadTasks() {
            vm.list = TasksService.getTasks();
        }
    }

})();
