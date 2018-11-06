import fs from 'fs';
import path from 'path';

import executeCommand from '../executeCommand';
import { getFromCache, putToCache } from '../../cache';
import { mapNpmDependency, mapBowerDependency } from '../mapDependencies';
import { decodePath } from '../decodePath';
import { parseJSON } from '../parseJSON';

function getDependenciesFromPackageJson(projectPath) {
  const packageJson = parseJSON(fs.readFileSync(path.normalize(`${projectPath}/package.json`)));
  return packageJson.dependencies || [];
}

function getDevDependenciesFromPackageJson(projectPath) {
  const packageJson = parseJSON(fs.readFileSync(path.normalize(`${projectPath}/package.json`)));
  return packageJson.devDependencies || [];
}

async function getRegularNpmDependencies(req) {
  const projectPath = decodePath(req.params.projectPath);
  const dependenciesInPackageJson = getDependenciesFromPackageJson(projectPath);

  const commandLsResult = await executeCommand(projectPath, 'npm ls --depth=0 --json');
  const commandLsJSON = parseJSON(commandLsResult.stdout);
  const dependenciesInstalled = commandLsJSON.dependencies;

  const commandOutdatedResult = await executeCommand(projectPath, 'npm outdated --json');
  const outdated = parseJSON(commandOutdatedResult.stdout);

  const extraneous = Object.keys(dependenciesInstalled)
    .filter(name => dependenciesInstalled[name].extraneous);

  return [...Object.keys(dependenciesInPackageJson), ...extraneous]
    .map(name => mapNpmDependency(
      name,
      dependenciesInstalled[name],
      outdated && outdated[name],
      dependenciesInPackageJson[name],
    ));
}

async function getDevNpmDependencies(req) {
  const projectPath = decodePath(req.params.projectPath);
  const dependenciesInPackageJson = getDevDependenciesFromPackageJson(projectPath);

  const commandLsResult = await executeCommand(projectPath, 'npm ls --depth=0 --json');
  const commandLsJSON = parseJSON(commandLsResult.stdout);
  const dependenciesInstalled = commandLsJSON.dependencies;

  const commandOutdatedResult = await executeCommand(projectPath, 'npm outdated --json');
  const outdated = parseJSON(commandOutdatedResult.stdout);

  const extraneous = Object.keys(dependenciesInstalled)
    .filter(name => dependenciesInstalled[name].extraneous);

  return [...Object.keys(dependenciesInPackageJson), ...extraneous]
    .map(name => mapNpmDependency(
      name,
      dependenciesInstalled[name],
      outdated && outdated[name],
      dependenciesInPackageJson[name],
    ));
}

async function getRegularBowerDependencies(req) {
  const projectPath = decodePath(req.params.projectPath);
  const commandLsResult = await executeCommand(projectPath, 'bower list --json');
  const { dependencies, pkgMeta } = parseJSON(commandLsResult.stdout);

  return Object.keys(dependencies)
    .filter(name => Object.keys(pkgMeta.dependencies).includes(name))
    .map(name => mapBowerDependency(name, dependencies[name]));
}

async function getDevBowerDependencies(req) {
  const projectPath = decodePath(req.params.projectPath);
  const commandLsResult = await executeCommand(projectPath, 'bower list --json');
  const { dependencies, pkgMeta } = parseJSON(commandLsResult.stdout);

  return Object.keys(dependencies)
    .filter(name => Object.keys(pkgMeta.devDependencies).includes(name))
    .map(name => mapBowerDependency(name, dependencies[name]));
}

export async function getRegularDependencies(req, res) {
  const npmCacheName = `${req.params.projectPath}-npmRegular`;
  const bowerCacheName = `${req.params.projectPath}-bowerRegular`;
  let npmDependencies = [];
  let bowerDependencies = [];

  try {
    npmDependencies = getFromCache(npmCacheName) || await getRegularNpmDependencies(req);
  } catch (e) { console.error(e); }

  try {
    bowerDependencies = getFromCache(bowerCacheName) || await getRegularBowerDependencies(req);
  } catch (e) { console.error(e); /* TODO throw error to frontend - bower error */ }

  putToCache(npmCacheName, npmDependencies);
  putToCache(bowerCacheName, bowerDependencies);

  res.json([...npmDependencies, ...bowerDependencies]);
}

export async function getDevDependencies(req, res) {
  const npmCacheName = `${req.params.projectPath}-npmDev`;
  const bowerCacheName = `${req.params.projectPath}-bowerDev`;
  let npmDevDependencies = [];
  let bowerDevDependencies = [];

  try {
    npmDevDependencies = getFromCache(npmCacheName) || await getDevNpmDependencies(req);
  } catch (e) { console.error(e); }

  try {
    bowerDevDependencies = getFromCache(bowerCacheName) || await getDevBowerDependencies(req);
  } catch (e) { console.error(e); }

  putToCache(npmCacheName, npmDevDependencies);
  putToCache(bowerCacheName, bowerDevDependencies);

  res.json([...npmDevDependencies, ...bowerDevDependencies]);
}

export async function getRegularDependenciesSimple(req, res) {
  const projectPath = decodePath(req.params.projectPath);

  let npmDependencies = [];
  let bowerDependencies = [];

  try {
    const packageJson = parseJSON(fs.readFileSync(path.normalize(`${projectPath}/package.json`)));
    const dependencies = packageJson.dependencies || [];
    npmDependencies = Object.keys(dependencies).map(name => ({
      name,
      repo: 'npm',
      required: dependencies[name],
      installed: undefined,
      wanted: undefined,
      latest: undefined,
    }));
  } catch (e) { console.error(e); }

  try {
    bowerDependencies = [];
  } catch (e) { console.error(e); }

  res.json([...npmDependencies, ...bowerDependencies]);
}

export async function getDevDependenciesSimple(req, res) {
  const projectPath = decodePath(req.params.projectPath);

  let npmDevDependencies = [];
  let bowerDevDependencies = [];

  try {
    const packageJson = parseJSON(fs.readFileSync(path.normalize(`${projectPath}/package.json`)));
    const devDependencies = packageJson.devDependencies || [];
    npmDevDependencies = Object.keys(devDependencies).map(name => ({
      name,
      repo: 'npm',
      required: devDependencies[name],
      installed: undefined,
      wanted: undefined,
      latest: undefined,
    }));
  } catch (e) { console.error(e); }

  try {
    bowerDevDependencies = [];
  } catch (e) { console.error(e); }

  res.json([...npmDevDependencies, ...bowerDevDependencies]);
}
