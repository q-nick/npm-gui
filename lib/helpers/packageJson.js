'use strict';

var helpers = require('./helpers.js');
var fs = require('fs');

module.exports.PackageJson = PackageJson;

function PackageJson(path) {
    this.getDependencies = getDependencies;
    this.getDependenciesArray = getDependenciesArray;
    this.removeDependence = removeDependence;

    this.getDevDependencies = getDevDependencies;
    this.getDevDependenciesArray = getDevDependenciesArray;
    this.removeDevDependence = removeDevDependence;

    this.getTasks = getTasks;
    this.getTasksArray = getTasksArray;
    this.removeTask = removeTask;
    this.addTask = addTask;

    this.getBin = getBin;

    var parsedPackage = JSON.parse(fs.readFileSync(path || './package.json', 'utf-8'));

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
        helpers.buildArrayFromObject(obj, preparedArray, 'key', 'value');
        return preparedArray;
    }

    /** Dependencies **/
    function getDependencies() {
        return parsedPackage.dependencies;
    }

    function getDependenciesArray() {
        return buildArrayFromObject(getDependencies());
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
        fs.writeFileSync('./package.json', JSON.stringify(parsedPackage, null, 2));
    }

    function getBin() {
        if (!parsedPackage.bin) return;

        return typeof parsedPackage.bin === 'string' ? parsedPackage.bin : parsedPackage.bin[parsedPackage.name];
    }
}
