// this should be removed
const UtilsService = require('../service/utils/utils.service.js');
const fs = require('fs');

module.exports = class PackageJson {
  constructor(path, name = 'package') {
    this.path = path;
    this.name = `${name}.json`;

    this.parsedPackage = JSON.parse(fs.readFileSync(`${this.path}/${this.name}`, 'utf-8'));
  }

  // ////////////////////////////////
  remove(from, what) {
    delete from[what];
    this.save();
  }

  add(to, what, value) {
    to[what] = value;
    this.save();
  }

  buildArrayFromObject(obj) {
    const preparedArray = [];
    UtilsService.buildArrayFromObject(obj, preparedArray, 'key', 'value');
    return preparedArray;
  }

  /** Dependencies **/
  getDependencies() {
    return this.parsedPackage.dependencies;
  }

  getDependenciesArray() {
    return this.buildArrayFromObject(this.getDependencies());
  }

  getDependenciesArrayAs(repo) {
    const preparedDependenciesArray = this.getDependenciesArray();

    for (let i = 0; i < preparedDependenciesArray.length; i++) {
      preparedDependenciesArray[i].repo = repo;
    }

    return preparedDependenciesArray;
  }

  removeDependence(name) {
    this.remove(this.parsedPackage.dependencies, name);
  }


  /** Dev Dependencies **/
  getDevDependencies() {
    return this.parsedPackage.devDependencies;
  }

  getDevDependenciesArray() {
    return this.buildArrayFromObject(this.getDevDependencies());
  }

  getDevDependenciesArrayAs(repo) {
    const preparedDependenciesArray = this.getDevDependenciesArray();

    for (let i = 0; i < preparedDependenciesArray.length; i++) {
      preparedDependenciesArray[i].repo = repo;
    }

    return preparedDependenciesArray;
  }

  removeDevDependence(name) {
    this.remove(this.parsedPackage.devDependencies, name);
  }


  /** Scripts **/
  getTasks() {
    return this.parsedPackage.scripts;
  }

  getTasksArray() {
    return this.buildArrayFromObject(getTasks());
  }

  removeTask(name) {
    this.remove(this.parsedPackage.scripts, name);
  }

  addTask(name, command) {
    this.add(this.parsedPackage.scripts, name, command);
  }

  /** others **/
  save() {
    fs.writeFileSync(`${this.path}/${this.name}`, JSON.stringify(this.parsedPackage, null, 2));
  }

  getBin() {
    if (!this.parsedPackage.bin) return null;

    return typeof this.parsedPackage.bin === 'string' ?
      this.parsedPackage.bin
      :
      this.parsedPackage.bin[this.parsedPackage.name];
  }

  getParsed() {
    return this.parsedPackage;
  }
};
