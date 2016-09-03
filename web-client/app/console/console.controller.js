(function() {
    'use strict';

    angular
        .module('npm-gui')
        .controller('ConsoleController', ConsoleController);

    function ConsoleController(ConsoleService) {
        var vm = this;
        vm.clearConsole = clearConsole;
        vm.log = ConsoleService.getLog();

        function clearConsole() {
            ConsoleService.clearLog();
        }
    }

})();
