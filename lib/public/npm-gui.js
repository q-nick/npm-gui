webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(2);

	__webpack_require__(3);
	__webpack_require__(4);

	__webpack_require__(5);

	__webpack_require__(6);
	__webpack_require__(7);

	__webpack_require__(8);
	__webpack_require__(9);

	__webpack_require__(10);

/***/ },
/* 1 */
/***/ function(module, exports) {

	(function() {
	    'use strict';

	    angular.module('npm-gui', [
	        'ngAnimate',
	        'ngRoute',
	        'ui.bootstrap'
	    ]);

	})();

/***/ },
/* 2 */
/***/ function(module, exports) {

	(function() {
	    'use strict';

	    angular
	        .module('npm-gui')
	        .config(['$routeProvider', '$locationProvider',
	            function($routeProvider, $locationProvider, ListService) {
	                $routeProvider
	                    .when('/dependencies', {
	                        templateUrl: 'app/modules/index.modules.html',
	                        controller: 'ModulesController',
	                        controllerAs: 'modules',
	                        resolve: {
	                            modules: ['ListService', function(ListService) {
	                                return ListService.modules;
	                            }]
	                        }
	                    })
	                    .when('/dependencies-dev', {
	                        templateUrl: 'app/modules/index.modules.html',
	                        controller: 'ModulesController',
	                        controllerAs: 'modules',
	                        resolve: {
	                            modules: ['ListService', function(ListService) {
	                                return ListService.devModules;
	                            }]
	                        }
	                    })
	                    .when('/tasks', {
	                        templateUrl: 'app/tasks/index.tasks.html',
	                        controller: 'TasksController',
	                        controllerAs: 'tasks'
	                    })
	                    .when('/builder', {
	                        templateUrl: 'app/builder/index.builder.html',
	                        controller: 'BuilderController',
	                        controllerAs: 'builder'
	                    })
	                    .otherwise('/dependencies');

	                $locationProvider.html5Mode(false);
	            }]);

	})();

/***/ },
/* 3 */
/***/ function(module, exports) {

	(function() {
	    'use strict';

	    angular
	        .module('npm-gui')
	        .factory('ListFactory', ListFactory);

	    function ListFactory($http) {
	        return factoryMethod;

	        function factoryMethod(listName) {
	            var list = {
	                loading: false,
	                error: false,
	                data: [],
	                clearFlags: function() {
	                    this.loading = false;
	                    this.error = false;
	                }
	            };

	            return {
	                get: get,
	                add: add,
	                remove: remove
	            };

	            function get() {
	                list.clearFlags();
	                list.loading = true;

	                var req = {
	                    method: 'GET',
	                    url: '/' + listName
	                };

	                $http(req).success(onGetSuccess).error(onGetError);

	                return list;
	            }

	            function onGetSuccess(data) {
	                angular.copy(data, list.data);
	                list.clearFlags();
	            }

	            function onGetError() {
	                list.clearFlags();
	                list.error = true;
	            }

	            function add(key, value) {
	                var req = {
	                    method: 'PUT',
	                    url: '/' + listName,
	                    data: {
	                        key: key,
	                        value: value
	                    }
	                };

	                //it should be promise? or maybe console should work on websocket?
	                $http(req);//.success(onGetModulesSuccess).error(onGetModulesError);
	            }

	            function remove(key) {
	                var req = {
	                    method: 'DELETE',
	                    url: '/' + listName + '/' + key
	                };

	                //it should be promise? or maybe console should work on websocket?
	                $http(req);//.success(onGetModulesSuccess).error(onGetModulesError);
	            }
	        }
	    }
	    ListFactory.$inject = ["$http"];

	})();


/***/ },
/* 4 */
/***/ function(module, exports) {

	(function() {
	    'use strict';

	    angular
	        .module('npm-gui')
	        .factory('ListService', ListService);

	    function ListService(ListFactory) {
	        var modules = new ListFactory('modules');
	        var devModules = new ListFactory('devModules');
	        var binModules = new ListFactory('binModules');
	        var tasks = new ListFactory('tasks');

	        return {
	            modules: modules,
	            devModules: devModules,
	            binModules: binModules,
	            tasks: tasks
	        };
	    }
	    ListService.$inject = ["ListFactory"];

	})();


/***/ },
/* 5 */
/***/ function(module, exports) {

	(function() {
	    'use strict';

	    angular
	        .module('npm-gui')
	        .controller('ModulesController', ModulesController);

	    function ModulesController(modules) {
	        var vm = this;

	        loadModules();

	        vm.addModule = addModule;
	        vm.removeModule = removeModule;
	        vm.loadModules = loadModules;
	        vm.reinstallModules = reinstallModules;

	        function addModule() {
	            modules.add(vm.newModuleName, vm.newModuleVersion);
	            vm.newModuleName = '';
	            vm.newModuleVersion = '';
	        }

	        function removeModule(module) {
	            modules.remove(module.key);
	        }

	        function loadModules() {
	            vm.list = modules.get();
	        }

	        function reinstallModules() {
	            vm.list = modules.get();
	        }
	    }
	    ModulesController.$inject = ["modules"];

	})();


/***/ },
/* 6 */
/***/ function(module, exports) {

	(function() {
	    'use strict';

	    angular
	        .module('npm-gui')
	        .factory('TasksService', TasksService);

	    function TasksService($http) {

	        return {
	            run: run,
	            getHelp: getHelp
	        };

	        function run(name) {
	            var req = {
	                method: 'POST',
	                url: '/tasks/' + name
	            };

	            //it should be promise? or maybe console should work on websocket?
	            $http(req);//.success(onGetTasksSuccess).error(onGetTasksError);
	        }

	        function getHelp(name) {
	            var req = {
	                method: 'GET',
	                url: '/tasks/' + name + '/help'
	            };

	            return $http(req);
	        }
	    }
	    TasksService.$inject = ["$http"];

	})();


/***/ },
/* 7 */
/***/ function(module, exports) {

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
	    TasksController.$inject = ["ListService", "TasksService"];

	})();


/***/ },
/* 8 */
/***/ function(module, exports) {

	(function() {
	    'use strict';

	    angular
	        .module('npm-gui')
	        .factory('ConsoleService', ConsoleService);

	    function ConsoleService($timeout) {
	        var log = {data: ''};
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
	    ConsoleService.$inject = ["$timeout"];

	})();


/***/ },
/* 9 */
/***/ function(module, exports) {

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
	    ConsoleController.$inject = ["ConsoleService"];

	})();


/***/ },
/* 10 */
/***/ function(module, exports) {

	(function() {
	    'use strict';

	    angular
	        .module('npm-gui')
	        .controller('BuilderController', BuilderController);

	    function BuilderController(TasksService,
	                               ListService) {
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
	            var command = './node_modules/' + vm.command + '/bin/' + vm.command;

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
	    BuilderController.$inject = ["TasksService", "ListService"];

	})();


/***/ }
]);