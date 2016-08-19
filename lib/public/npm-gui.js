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

	__webpack_require__(11);

	__webpack_require__(12);

	__webpack_require__(13);
	__webpack_require__(14);

	__webpack_require__(15);
	//require("./crawler/crawler.controller.js");


/***/ },
/* 1 */
/***/ function(module, exports) {

	(function() {
	    'use strict';

	    angular.module('npm-gui', [
	        'ngAnimate',
	        'ngRoute',
	        'ui.bootstrap'
	    ]).run(["ProjectService", "ConsoleService", "$route", function(ProjectService, ConsoleService, $route) {
	        ProjectService.onProjectChange(function() {
	            ConsoleService.clearLog();
	            $route.reload();
	        });
	    }]);

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
	                    .when('/dependencies-global', {
	                        templateUrl: 'app/modules/index.modules.html',
	                        controller: 'ModulesController',
	                        controllerAs: 'modules',
	                        resolve: {
	                            modules: ['ListService', function(ListService) {
	                                return ListService.globalModules;
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
	            }
	        ]);

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

	        function factoryMethod(listName, additional) {
	            var list = {
	                loading: true,
	                error: false,
	                versionsLoading: true,
	                nspLoading: true,
	                data: [],
	                clearFlags: function() {
	                    this.loading = false;
	                    this.error = false;
	                }
	            };

	            return {
	                get: get,
	                add: add,
	                remove: remove,
	                list: list
	            };

	            function get() {
	                list.clearFlags();
	                list.loading = true;

	                var req = {
	                    method: 'GET',
	                    url: '/' + listName
	                };

	                $http(req).success(onGetSuccess.bind(this)).error(onGetError.bind(this));

	                return list;
	            }

	            function onGetSuccess(data) {
	                angular.copy(data, list.data);
	                list.clearFlags();
	                if (additional.afterGetSuccess) additional.afterGetSuccess();
	            }

	            function onGetError() {
	                list.clearFlags();
	                list.error = true;
	            }

	            function add(key, value, repo) {
	                var req = {
	                    method: 'PUT',
	                    url: '/' + listName + '/' + repo,
	                    data: {
	                        key: key,
	                        value: value
	                    }
	                };

	                //it should be promise? or maybe console should work on websocket?
	                $http(req).success(get); //.success(onGetModulesSuccess).error(onGetModulesError);
	            }

	            function remove(key, repo) {
	                var req = {
	                    method: 'DELETE',
	                    url: '/' + listName + '/' + repo + '/' + key
	                };

	                //it should be promise? or maybe console should work on websocket?
	                $http(req).success(get); //.success(onGetModulesSuccess).error(onGetModulesError);
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

	    function ListService(ListFactory, ModulesListFactory) {
	        var modules = new ModulesListFactory('modules');
	        var devModules = new ModulesListFactory('devModules');
	        var globalModules = new ModulesListFactory('globalModules');
	        var binModules = new ListFactory('binModules');
	        var tasks = new ListFactory('tasks');

	        return {
	            modules: modules,
	            devModules: devModules,
	            globalModules: globalModules,
	            binModules: binModules,
	            tasks: tasks
	        };
	    }
	    ListService.$inject = ["ListFactory", "ModulesListFactory"];

	})();


/***/ },
/* 5 */
/***/ function(module, exports) {

	(function() {
	    'use strict';

	    angular
	        .module('npm-gui')
	        .factory('ModulesListFactory', ModulesListFactory);

	    function ModulesListFactory(ListFactory, $http) {
	        return factoryMethod;

	        function factoryMethod(listName) {
	            var listInstance = new ListFactory(listName, {
	                afterGetSuccess: function() {
	                    getVersions();
	                    getNSP();
	                }
	            });

	            function getVersions() {
	                listInstance.list.versionsLoading = true;

	                var req = {
	                    method: 'GET',
	                    url: '/' + listName + '/versions'
	                };

	                $http(req).success(onGetVersionsSuccess).error(onGetVersionsError);
	            }

	            function onGetVersionsSuccess(data) {
	                for (var i = 0; i < listInstance.list.data.length; i++) {
	                    var obj = listInstance.list.data[i];

	                    if (data[obj.key]) {
	                        obj.version = data[obj.key].version;
	                        obj.wanted = data[obj.key].wanted;
	                        obj.latest = data[obj.key].latest;
	                    }
	                }
	                listInstance.list.versionsLoading = false;
	            }

	            function onGetVersionsError(data) {
	                //console.log(data);
	                console.log(data.length);
	            }

	            function getNSP() {
	                listInstance.list.nspLoading = true;

	                var req = {
	                    method: 'GET',
	                    url: '/' + listName + '/nsp'
	                };

	                $http(req).success(onGetNSPSuccess).error(onGetNSPError);
	            }

	            function onGetNSPSuccess(data) {
	                for (var i = 0; i < listInstance.list.data.length; i++) {
	                    var obj = listInstance.list.data[i];

	                    if (data[obj.key]) {
	                        obj.nsp = {
	                            title: data[obj.key].title,
	                            advisory: data[obj.key].advisory,
	                            vulnerable_versions: data[obj.key].vulnerable_versions,
	                            patched_version: data[obj.key].patched_version
	                        };
	                    }
	                }
	                listInstance.list.nspLoading = false;
	            }

	            function onGetNSPError(data) {
	                //console.log(data);
	                console.log(data.length);
	            }

	            return listInstance;
	        }
	    }
	    ModulesListFactory.$inject = ["ListFactory", "$http"];

	})();


/***/ },
/* 6 */
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
	        vm.updateModule = updateModule;
	        vm.removeModule = removeModule;
	        vm.loadModules = loadModules;
	        vm.reinstallModules = reinstallModules;
	        vm.newModuleRepo = 'npm';

	        function addModule() {
	            modules.add(vm.newModuleName, vm.newModuleVersion, vm.newModuleRepo);
	            vm.newModuleName = '';
	            vm.newModuleVersion = '';
	        }

	        function updateModule(moduleToUpdate, version) {
	            modules.add(moduleToUpdate.key, version, moduleToUpdate.repo);
	        }

	        function removeModule(moduleToRemove) {
	            modules.remove(moduleToRemove.key, moduleToRemove.repo);
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
/* 7 */
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
	            $http(req); //.success(onGetTasksSuccess).error(onGetTasksError);
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
/* 8 */
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
/* 9 */
/***/ function(module, exports) {

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
	    ConsoleService.$inject = ["$timeout"];

	})();


/***/ },
/* 10 */
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
/* 11 */
/***/ function(module, exports) {

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
	    BuilderController.$inject = ["TasksService", "ListService"];

	})();


/***/ },
/* 12 */
/***/ function(module, exports) {

	(function() {
	    'use strict';

	    angular
	        .module('npm-gui')
	        .controller('NavigationController', NavigationController);

	    function NavigationController(ProjectService, $uibModal) {
	        var vm = this;
	        vm.theme = 'sandstone';
	        vm.project = ProjectService.getInfo();

	        vm.openProject = openProject;

	        function openProject() {
	            var modalInstance = $uibModal.open({
	                templateUrl: 'app/project/project.html',
	                controller: 'ProjectController',
	                controllerAs: '$ctrl'
	            });
	        }
	    }
	    NavigationController.$inject = ["ProjectService", "$uibModal"];

	})();


/***/ },
/* 13 */
/***/ function(module, exports) {

	(function() {
	    'use strict';

	    angular
	        .module('npm-gui')
	        .controller('ProjectController', ProjectController);

	    function ProjectController(ProjectService, CrawlerService, $uibModalInstance) {
	        var vm = this;

	        vm.files = [];
	        vm.projectPath = ProjectService.getInfo().data.projectPath;
	        vm.loadNewPath = loadNewPath;
	        vm.packageJsonFound = false;

	        loadNewPath('');

	        function loadNewPath(affix) {
	            CrawlerService
	                .showPath(vm.projectPath, affix)
	                .success(function(data) {
	                    vm.projectPath = data.path;
	                    angular.copy(data.files, vm.files);
	                    vm.files.unshift({
	                        directory: true,
	                        name: '..'
	                    });

	                    var containPackageJson = false;
	                    vm.files.find(function(file) {
	                        if (file.name === 'package.json') {
	                            containPackageJson = true;
	                        }
	                    });
	                    vm.packageJsonFound = containPackageJson;
	                })
	                .error(function() {
	                    angular.copy([], vm.files);
	                });
	        }

	        vm.ok = function() {
	            ProjectService.setPath(vm.projectPath);
	            $uibModalInstance.close();
	        };

	        vm.cancel = function() {
	            $uibModalInstance.dismiss('cancel');
	        };
	    }
	    ProjectController.$inject = ["ProjectService", "CrawlerService", "$uibModalInstance"];

	})();


/***/ },
/* 14 */
/***/ function(module, exports) {

	(function() {
	    'use strict';

	    angular
	        .module('npm-gui')
	        .factory('ProjectService', ProjectService);

	    function ProjectService($http) {
	        var project = {
	            data: {
	                name: 'Unknown'
	            },
	            loading: false,
	            error: false
	        };

	        loadInfo();

	        return {
	            getInfo: getInfo,
	            setPath: setPath,
	            loadInfo: loadInfo,
	            onProjectChange: onProjectChange
	        };

	        function onLoadSuccess(data) {
	            angular.copy(data, project.data);
	        }

	        function onLoadError() {
	            project.error = true;
	        }

	        function loadInfo() {
	            var req = {
	                method: 'GET',
	                url: '/project'
	            };

	            $http(req).success(onLoadSuccess.bind(this)).error(onLoadError.bind(this));
	        }

	        function getInfo() {
	            return project;
	        }

	        var onProjectChangeCb = null;

	        function onProjectChange(cb) {
	            onProjectChangeCb = cb;
	        }

	        function setPath(newPath) {
	            var req = {
	                method: 'PUT',
	                url: '/project/path/' + encodeURIComponent(newPath)
	            };

	            $http(req).success(function() {
	                loadInfo();
	                onProjectChangeCb();
	            });
	        }
	    }
	    ProjectService.$inject = ["$http"];

	})();


/***/ },
/* 15 */
/***/ function(module, exports) {

	(function() {
	    'use strict';

	    angular
	        .module('npm-gui')
	        .factory('CrawlerService', CrawlerService);

	    function CrawlerService($http) {
	        return {
	            showPath: showPath
	        };

	        function showPath(path, affix) {
	            //build path which will be shown
	            var pathToShow = path.replace(/\/$/, '');
	            if (affix === '..') {
	                //for up directory exception
	                pathToShow = pathToShow.split('/').reverse();
	                pathToShow.shift();
	                pathToShow = pathToShow.reverse().join('/').replace(/\/$/, '');
	            } else {
	                //regular folder
	                pathToShow += '/' + affix;
	            }

	            var req = {
	                method: 'GET',
	                url: '/crawler/' + encodeURIComponent(pathToShow)
	            };

	            return $http(req);
	        }
	    }
	    CrawlerService.$inject = ["$http"];

	})();


/***/ }
]);