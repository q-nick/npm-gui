(function() {
    'use strict';

    angular
        .module('npm-gui')
        .controller('TasksController', TasksController);

    function TasksController(ListService, TasksService) {
        var vm = this;

        loadTasks();

        vm.addTask = addTask;
        vm.removeTask = removeTask;
        vm.runTask = runTask;
        vm.loadTasks = loadTasks;

        function addTask() {
            ListService.tasks.add(vm.newTaskName, vm.newTaskCommand);
            vm.newTaskName = '';
            vm.newTaskCommand = '';
        }

        function removeTask(task) {
            ListService.tasks.remove(task.key);
        }

        function runTask(task) {
            TasksService.run(task.key);
        }

        function loadTasks() {
            vm.list = ListService.tasks.get();
        }
    }

})();
