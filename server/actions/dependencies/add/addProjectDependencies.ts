import * as fs from 'fs';
import * as express from 'express';

import executeCommand, { executeCommandJSON } from '../../executeCommand';
import { withCacheUpdate, withCacheInvalidate } from '../../../cache';
import {
  mapNpmDependency,
  mapYarnResultTableToVersion,
  mapYarnResultTreeToBasic,
  mapBowerDependency,
} from '../../mapDependencies';
import { decodePath } from '../../decodePath';
import { parseJSON } from '../../parseJSON';
import { hasYarn } from '../../hasYarn';

function getTypeFromPackageJson(packageJson: any, dependencyName: string): 'regular' | 'dev' {
  if (packageJson.dependencies && packageJson.dependencies[dependencyName]) {
    return 'regular';
  }

  if (packageJson.devDependencies && packageJson.devDependencies[dependencyName]) {
    return 'dev';
  }

  return null;
}

function getRequiredFromPackageJson(packageJson: any, dependencyName: string): 'regular' | 'dev' {
  if (packageJson.dependencies && packageJson.dependencies[dependencyName]) {
    return packageJson.dependencies[dependencyName];
  }

  if (packageJson.devDependencies && packageJson.devDependencies[dependencyName]) {
    return packageJson.devDependencies[dependencyName];
  }

  return null;
}

async function getNpmPackageWithInfo(projectPath: string, dependencyName: string): Promise<Dependency.Entire> { // tslint:disable:max-line-length
  // installed or not
  const commandLsResult = await executeCommand(projectPath, `npm ls ${dependencyName} --depth=0 --json`);
  const { dependencies } = parseJSON(commandLsResult.stdout);

  // latest, wanted
  const commandOutdatedResult = await executeCommand(projectPath, `npm outdated ${dependencyName} --json`);
  const outdated = parseJSON(commandOutdatedResult.stdout) || { outdated: [] };

  // required & type
  const packageJson = parseJSON(fs.readFileSync(`${projectPath}/package.json`, 'utf-8'));
  const type = getTypeFromPackageJson(packageJson, dependencyName);
  const required = getRequiredFromPackageJson(packageJson, dependencyName);

  return mapNpmDependency(
    dependencyName, // name
    dependencies[dependencyName],
    outdated && outdated[dependencyName],
    required,
    type,
  );
}

async function getYarnNpmPackageWithInfo(projectPath: string, dependencyName: string): Promise<Dependency.Entire> { // tslint:disable:max-line-length
  // installed or not
  const commandLsJSON = await executeCommand(projectPath, `yarn list --pattern ${dependencyName} --depth=0 --json`);
  const commandLsJSONResults: Yarn.Result[] = commandLsJSON.stdout.split('\n').filter(s => s).map(parseJSON);
  const installed = mapYarnResultTreeToBasic(commandLsJSONResults);

  // latest, wanted
  const outdatedResult = await executeCommand(projectPath, `yarn outdated ${dependencyName} --depth=0 --json`);
  const outdatedResults: Yarn.Result[] = outdatedResult.stdout.split('\n').filter(s => s).map(parseJSON);
  const outdated = mapYarnResultTableToVersion(outdatedResults);

  // required & type
  const packageJson = parseJSON(fs.readFileSync(`${projectPath}/package.json`, 'utf-8'));
  const type = getTypeFromPackageJson(packageJson, dependencyName);
  const required = getRequiredFromPackageJson(packageJson, dependencyName);

  return mapNpmDependency(
    dependencyName,
    installed[dependencyName],
    outdated && outdated[dependencyName],
    required,
    type,
    'yarn',
  );
}

async function getBowerPackageWithInfo(projectPath: string, dependencyName: string, type: Dependency.Type): Promise<Dependency.Entire> {
  const { dependencies } = await executeCommandJSON(projectPath, 'bower ls --json', true);
  return mapBowerDependency(dependencyName, dependencies[dependencyName], type);
}

async function addNpmDependency(projectPath: string, dependency: Dependency.Basic, type: Dependency.Type): Promise<Dependency.Entire> {
  // add
  await executeCommand(projectPath, `npm install ${dependency.name}@${dependency.version || ''} -${type === 'regular' ? 'P' : 'D'}`, true);
  // here is a change, we change param -S to -P in case to move dependency from dev to regular(prod?)?

  return getNpmPackageWithInfo(projectPath, dependency.name);
}

async function addNpmDependencies(projectPath: string, dependencies: Dependency.Basic[], type: Dependency.Type): Promise<void> {
  // add list
  const dependenciesToInstall = dependencies.map(d => `${d.name}@${d.version || ''}`);
  const command = `npm install ${dependenciesToInstall.join(' ')} -${type === 'regular' ? 'P' : 'D'}`;
  await executeCommand(projectPath, command, true);
}

async function addBowerDependency(projectPath: string, dependency: Dependency.Basic, type: Dependency.Type): Promise<Dependency.Entire> {
  // add
  await executeCommand(projectPath, `bower install ${dependency.name}#${dependency.version || ''}${type === 'regular' ? ' -S' : ' -D'}`, true);

  return getBowerPackageWithInfo(projectPath, dependency.name, type);
}

async function addBowerDependencies(projectPath: string, dependencies: Dependency.Basic[], type: Dependency.Type): Promise<void> {
  // add list
  const dependenciesToInstall = dependencies.map(d => `${d.name}#${d.version || ''}`);
  const command = `bower install ${dependenciesToInstall.join(' ')}${type === 'regular' ? ' -S' : ' -D'}`;
  await executeCommand(projectPath, command, true);
}

async function addYarnDependency(projectPath: string, dependency: Dependency.Basic, type: Dependency.Type): Promise<Dependency.Entire> {
  // add
  await executeCommand(projectPath, `yarn add ${dependency.name}@${dependency.version || ''}${type === 'regular' ? '' : ' -D'}`, true);

  return getYarnNpmPackageWithInfo(projectPath, dependency.name);
}

async function addYarnDependencies(projectPath: string, dependencies: Dependency.Basic[], type: Dependency.Type): Promise<void> {
  // add list
  const dependenciesToInstall = dependencies.map(d => `${d.name}@${d.version || ''}`);
  const command = `yarn add ${dependenciesToInstall.join(' ')}${type === 'regular' ? '' : ' -D'}`;
  await executeCommand(projectPath, command, true);
}

// controllers
export async function addDependencies(req: express.Request, res: express.Response): Promise<void> {
  const { repoName, projectPath, type }: { repoName: string, projectPath: string, type: Dependency.Type } = req.params;
  const projectPathDecoded = decodePath(projectPath);
  const yarn = hasYarn(projectPathDecoded);
  const dependenciesToInstall: Dependency.Basic[] = req.body;
  let result: any = null;

  if (repoName === 'npm' && req.body.length === 1) {
    result = await withCacheUpdate(
      yarn ? addYarnDependency : addNpmDependency, `${projectPath}-npm`, 'name',
      projectPathDecoded, dependenciesToInstall[0], type,
    );
  } else if (repoName === 'npm' && req.body.length > 1) {
    result = await withCacheInvalidate(
      yarn ? addYarnDependencies : addNpmDependencies, `${projectPath}-npm`,
      projectPathDecoded, dependenciesToInstall, type,
    );
  } else if (repoName === 'bower' && req.body.length === 1) {
    result = await withCacheUpdate(
      addBowerDependency, `${projectPath}-bower`, 'name',
      projectPathDecoded, dependenciesToInstall[0], type);
  } else if (repoName === 'bower' && req.body.length > 1) {
    result = await withCacheInvalidate(
      addBowerDependencies, `${projectPath}-bower`,
      projectPathDecoded, dependenciesToInstall, type);
  }

  res.json(result);
}
