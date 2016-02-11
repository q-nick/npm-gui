(function() {
    'use strict';

    angular
        .module('npm-gui')
        .controller('BuilderController', BuilderController);

    function BuilderController(ListService, $scope) {
        var vm = this;

        vm.command = null;

        vm.dependencies = ListService.modules.get();
        vm.devDependencies = ListService.devModules.get();

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

        $scope.$watch('builder.command', function() {
            console.log(vm.command);
        });

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
            var command = './node_modules/' + vm.command + '/bin/' + vm.command;

            angular.forEach(vm.args, function(arg) {
                command += ' ' + arg.value;
            });

            ListService.tasks.add(vm.newTaskName, command);
        }
    }

})();
