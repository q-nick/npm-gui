(function() {
    'use strict';

    angular
        .module('npm-gui')
        .controller('BuilderController', BuilderController);

    function BuilderController(TasksService, ListService) {
        var vm = this;

        vm.command = null;
        vm.packageInfo = '';

        //available options
        vm.binPackages = ListService.binModules.get();
        vm.flags = [];

        vm.types = ['flag', 'path'];

        vm.args = [{
            type: 'flag',
            value: '-d'
        }, {
            type: 'path',
            value: './lib/helpers/*'
        }];

        vm.addArg = addArg;
        vm.removeArg = removeArg;
        vm.save = save;
        vm.commandChanged = commandChanged;

        function addArg() {
            vm.args.push({
                type: '',
                value: ''
            });
        }

        function removeArg(index) {
            vm.args.splice(index, 1);
        }

        function save() {
            var command = 'node_modules/.bin/' + vm.command;

            angular.forEach(vm.args, function(arg) {
                command += ' ' + arg.value;
            });

            ListService.tasks.add(vm.newTaskName, command);
        }

        function commandChanged() {
            TasksService.getHelp(vm.command)
                .success(function(data) {
                    vm.packageInfo = data.text;
                    angular.copy(data.flags, vm.flags);
                })
                .error(function() {

                });
        }
    }

})();
