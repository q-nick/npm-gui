(function() {
    'use strict';

    angular
        .module('npm-gui')
        .factory('ConsoleService', ConsoleService);

    function ConsoleService($timeout) {
        var log = {
            data: ''
        };
        var consoleSocket = null;

        initSocket();

        return {
            getLog: getLog,
            clearLog: clearLog,
            sendCommand: sendCommand
        };

        function initSocket() {
            consoleSocket = new WebSocket('ws://' + location.host);

            consoleSocket.onmessage = function(a) {
                $timeout(function() {
                    log.data = log.data + a.data;
                });
            };
        }

        function getLog() {
            return log;
        }

        function clearLog() {
            log.data = '';
        }

        function sendCommand() {
            //TODO send
        }
    }

})();
