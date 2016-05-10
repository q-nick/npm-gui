(function() {
    'use strict';

    angular
        .module('npm-gui')
        .controller('NavigationController', NavigationController);

    function NavigationController() {
        var vm = this;
        vm.theme = 'sandstone';
    }

})();
