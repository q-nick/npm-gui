'use strict';

module.exports = PackageJson;

/////////////////////

//this should be removed
var UtilsService = require('../service/utils/utils.service.js');
var ProjectService = require('../service/project/project.service.js');
//this should be removed

var fs = require('fs');

/////////////////////

function PackageJson(path, name) {
    this.getDependencies = getDependencies;
    this.getDependenciesArray = getDependenciesArray;
    this.getDependenciesArrayAs = getDependenciesArrayAs;
    this.removeDependence = removeDependence;

    this.getDevDependencies = getDevDependencies;
    this.getDevDependenciesArray = getDevDependenciesArray;
    this.getDevDependenciesArrayAs = getDevDependenciesArrayAs;
    this.removeDevDependence = removeDevDependence;

    this.getTasks = getTasks;
    this.getTasksArray = getTasksArray;
    this.removeTask = removeTask;
    this.addTask = addTask;

    this.getBin = getBin;
    this.getParsed = getParsed;

    this.save = save;

    var parsedPackage = JSON.parse(fs.readFileSync(path + '/' + (name ? name : 'package.json'), 'utf-8'));

    //////////////////////////////////
    function remove(from, what) {
        delete from[what];
        save();
    }

    function add(to, what, value) {
        to[what] = value;
        save();
    }

    function buildArrayFromObject(obj) {
        var preparedArray = [];
        UtilsService.buildArrayFromObject(obj, preparedArray, 'key', 'value');
        return preparedArray;
    }

    /** Dependencies **/
    function getDependencies() {
        return parsedPackage.dependencies;
    }

    function getDependenciesArray() {
        return buildArrayFromObject(getDependencies());
    }

    function getDependenciesArrayAs(repo) {
        var preparedDependenciesArray = getDependenciesArray();

        for (var i = 0; i < preparedDependenciesArray.length; i++) {
            preparedDependenciesArray[i].repo = repo;
        }

        return preparedDependenciesArray
    }

    function removeDependence(name) {
        remove(parsedPackage.dependencies, name);
    }


    /** Dev Dependencies **/
    function getDevDependencies() {
        return parsedPackage.devDependencies;
    }

    function getDevDependenciesArray() {
        return buildArrayFromObject(getDevDependencies());
    }

    function getDevDependenciesArrayAs(repo) {
        var preparedDependenciesArray = getDevDependenciesArray();

        for (var i = 0; i < preparedDependenciesArray.length; i++) {
            preparedDependenciesArray[i].repo = repo;
        }

        return preparedDependenciesArray;
    }

    function removeDevDependence(name) {
        remove(parsedPackage.devDependencies, name);
    }


    /**Scripts **/
    function getTasks() {
        return parsedPackage.scripts;
    }

    function getTasksArray() {
        return buildArrayFromObject(getTasks());
    }

    function removeTask(name) {
        remove(parsedPackage.scripts, name);
    }

    function addTask(name, command) {
        add(parsedPackage.scripts, name, command);
    }

    /** others **/
    function save() {
        fs.writeFileSync('./' + (name ? name : 'package.json'), JSON.stringify(parsedPackage, null, 2));
    }

    function getBin() {
        if (!parsedPackage.bin) return;

        return typeof parsedPackage.bin === 'string' ? parsedPackage.bin : parsedPackage.bin[parsedPackage.name];
    }

    function getParsed() {
        return parsedPackage;
    }
}
