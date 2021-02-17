import * as fs from 'fs';
import * as express from 'express';

import executeCommand, { executeCommandJSON } from '../../executeCommand';
import { withCacheUpdate, withCacheInvalidate } from '../../../cache';
import {
  getInstalledVersion,
  getLatestVersion,
  getWantedVersion,
  mapYarnResultTableToVersion,
  mapYarnResultTreeToBasic,
} from '../../mapDependencies';
import { decodePath } from '../../decodePath';
import { parseJSON } from '../../parseJSON';
import { hasYarn, hasNpm } from '../../hasYarn';

function getTypeFromPackageJson(packageJson: any, dependencyName: string): 'prod' | 'dev' | 'extraneous' {
  if (packageJson.dependencies && packageJson.dependencies[dependencyName]) {
    return 'prod';
  }

  if (packageJson.devDependencies && packageJson.devDependencies[dependencyName]) {
    return 'dev';
  }

  return 'extraneous';
}

function getRequiredFromPackageJson(packageJson: any, dependencyName: string): 'prod' | 'dev' | null {
  if (packageJson.dependencies && packageJson.dependencies[dependencyName]) {
    return packageJson.dependencies[dependencyName];
  }

  if (packageJson.devDependencies && packageJson.devDependencies[dependencyName]) {
    return packageJson.devDependencies[dependencyName];
  }

  return null;
}

async function getNpmPackageWithInfo(
  projectPath: string, dependencyName: string,
): Promise<Dependency.Entire> {
  // installed or not
  const { dependencies: installedInfo } = await executeCommandJSON<Commands.Installed>(projectPath, `npm ls ${dependencyName} --depth=0 --json`);

  // latest, wanted
  const outdatedInfo = await executeCommandJSON<Commands.Outdated>(projectPath, `npm outdated ${dependencyName} --json`);

  // required & type
  const packageJson = parseJSON(fs.readFileSync(`${projectPath}/package.json`, 'utf-8'));
  const type = getTypeFromPackageJson(packageJson, dependencyName);
  const required = getRequiredFromPackageJson(packageJson, dependencyName);

  const installed = getInstalledVersion(installedInfo[dependencyName]);
  const wanted = getWantedVersion(installed, outdatedInfo[dependencyName]);
  const latest = getLatestVersion(installed, wanted, outdatedInfo[dependencyName]);

  return {
    repo: 'npm',
    required,
    name: dependencyName,
    type,
    installed,
    wanted,
    latest,
  };
}

async function getYarnNpmPackageWithInfo(
  projectPath: string, dependencyName: string,
): Promise<Dependency.Entire> {
  // installed or not
  const commandLsJSON = await executeCommand(projectPath, `yarn list --pattern ${dependencyName} --depth=0 --json`);
  const commandLsJSONResults: Yarn.Result[] = commandLsJSON.stdout.split('\n').filter((s) => s).map(parseJSON);
  const installed = mapYarnResultTreeToBasic(commandLsJSONResults);

  // latest, wanted
  const outdatedResult = await executeCommand(projectPath, `yarn outdated ${dependencyName} --depth=0 --json`);
  const outdatedResults: Yarn.Result[] = outdatedResult.stdout.split('\n').filter((s) => s).map(parseJSON);
  const outdated = mapYarnResultTableToVersion(outdatedResults);

  // required & type
  const packageJson = parseJSON(fs.readFileSync(`${projectPath}/package.json`, 'utf-8'));
  const type = getTypeFromPackageJson(packageJson, dependencyName);
  const required = getRequiredFromPackageJson(packageJson, dependencyName);
  const mapNpmDependency:any = 1;

  return mapNpmDependency(
    dependencyName,
    installed[dependencyName],
    outdated && outdated[dependencyName],
    required,
    type,
    true,
    'yarn',
  );
}

async function addNpmDependency(
  projectPath: string, dependency: Dependency.Basic, type: Dependency.Type,
): Promise<Dependency.Entire> {
  // add
  const { error } = await executeCommandJSON(projectPath, `npm install ${dependency.name}@${dependency.version || ''} -${type === 'prod' ? 'P' : 'D'} --json`, true);
  // here is a change, we change param -S
  // to -P in case to move dependency from dev to regular(prod?)?

  if (error) {
    throw error.summary;
  }

  return getNpmPackageWithInfo(projectPath, dependency.name);
}

async function addNpmDependencies(
  projectPath: string, dependencies: Dependency.Basic[], type: Dependency.Type,
): Promise<void> {
  // add list
  const dependenciesToInstall = dependencies.map((d) => `${d.name}@${d.version || ''}`);
  const command = `npm install ${dependenciesToInstall.join(' ')} -${type === 'prod' ? 'P' : 'D'} --json`;
  const { error } = await executeCommandJSON(projectPath, command, true);

  if (error) {
    throw error.summary;
  }
}

async function addYarnDependency(
  projectPath: string, dependency: Dependency.Basic, type: Dependency.Type,
): Promise<Dependency.Entire> {
  // add
  const { stderr } = await executeCommand(projectPath, `yarn add ${dependency.name}@${dependency.version || ''}${type === 'prod' ? '' : ' -D'} --json`, true);

  if (stderr) {
    throw JSON.parse(stderr).data;
  }

  return getYarnNpmPackageWithInfo(projectPath, dependency.name);
}

async function addYarnDependencies(
  projectPath: string, dependencies: Dependency.Basic[], type: Dependency.Type,
): Promise<void> {
  // add list
  const dependenciesToInstall = dependencies.map((d) => `${d.name}@${d.version || ''}`);
  const command = `yarn add ${dependenciesToInstall.join(' ')}${type === 'prod' ? '' : ' -D'} --json`;
  const { stderr } = await executeCommand(projectPath, command, true);

  if (stderr) {
    throw JSON.parse(stderr).data;
  }
}

// controllers
export async function addDependencies(req: express.Request, res: express.Response): Promise<void> {
  const { projectPath, type }: any = req.params;
  const projectPathDecoded = decodePath(projectPath) as string;
  const yarn = hasYarn(projectPathDecoded);
  const npm = hasNpm(projectPathDecoded);

  const dependenciesToInstall = (req.body as Dependency.Basic[]).filter((d) => d.name);
  let result: any = null;

  if (npm || yarn) {
    if (dependenciesToInstall.length === 1) {
      result = await withCacheUpdate(
        yarn ? addYarnDependency : addNpmDependency,
        `${req.headers['x-cache-id']}-${projectPath}-npm`, 'name',
        projectPathDecoded, dependenciesToInstall[0], type,
      );
    } else if (dependenciesToInstall.length > 1) {
      result = await withCacheInvalidate(
        yarn ? addYarnDependencies : addNpmDependencies,
        `${req.headers['x-cache-id']}-${projectPath}-npm`,
        projectPathDecoded,
        dependenciesToInstall,
        type,
      );
    } else {
      throw Error('Invalid depedencies');
    }
    res.json(result);
  } else {
    res.status(400).json(null);
  }
}
