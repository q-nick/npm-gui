import * as fs from 'fs';
import type * as express from 'express';

import { executeCommandJSON } from '../../executeCommand';
// import { withCacheUpdate, withCacheInvalidate } from '../../../cache';
import {
  getInstalledVersion,
  getLatestVersion,
  getWantedVersion,
  // mapYarnResultTableToVersion,
  // mapYarnResultTreeToBasic,
} from '../../mapDependencies';
import { decodePath } from '../../decodePath';
import { parseJSON } from '../../parseJSON';
import { hasYarn, hasNpm } from '../../hasYarn';
import type * as Dependency from '../../../Dependency';
import type * as Commands from '../../../Commands';

function getTypeFromPackageJson(packageJson: any, dependencyName: string): 'dev' | 'extraneous' | 'prod' {
  if (packageJson.dependencies && packageJson.dependencies[dependencyName]) {
    return 'prod';
  }

  if (packageJson.devDependencies && packageJson.devDependencies[dependencyName]) {
    return 'dev';
  }

  return 'extraneous';
}

function getRequiredFromPackageJson(packageJson: any, dependencyName: string): 'dev' | 'prod' | null {
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

  const installed = getInstalledVersion(installedInfo ? installedInfo[dependencyName] : undefined);
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

async function addNpmDependency(
  projectPath: string, dependency: Dependency.Basic, type: Dependency.Type,
): Promise<Dependency.Entire> {
  // add
  await executeCommandJSON(projectPath, `npm install ${dependency.name}@${dependency.version ?? ''} -${type === 'prod' ? 'P' : 'D'} --json`, true);
  // here is a change, we change param -S
  // to -P in case to move dependency from dev to regular(prod?)?

  return getNpmPackageWithInfo(projectPath, dependency.name);
}

async function addNpmDependencies(
  projectPath: string, dependencies: Dependency.Basic[], type: Dependency.Type,
): Promise<void> {
  // add list
  const dependenciesToInstall = dependencies.map((d) => `${d.name}@${d.version ?? ''}`);
  const command = `npm install ${dependenciesToInstall.join(' ')} -${type === 'prod' ? 'P' : 'D'} --json`;
  await executeCommandJSON(projectPath, command, true);
}

// controllers
export async function addDependencies(
  req: express.Request<{
    projectPath: unknown; type: Dependency.Type; }, unknown, Dependency.Basic[]>,
  res: express.Response<Dependency.Entire | null>,
): Promise<void> {
  const { projectPath, type } = req.params;
  const projectPathDecoded = decodePath(projectPath);
  const yarn = hasYarn(projectPathDecoded);
  const npm = hasNpm(projectPathDecoded);

  const dependenciesToInstall = req.body.filter((d) => d.name);

  if (npm || yarn) {
    if (dependenciesToInstall.length === 1) {
      const result = await addNpmDependency(projectPathDecoded, dependenciesToInstall[0]!, type);
      res.json(result);
      // result = await withCacheUpdate(
      //   yarn ? addYarnDependency : addNpmDependency,
      //   `${req.headers['x-cache-id']}-${projectPath}-npm`, 'name',
      //   projectPathDecoded, dependenciesToInstall[0], type,
      // );
    } else if (dependenciesToInstall.length > 1) {
      await addNpmDependencies(projectPathDecoded, dependenciesToInstall, type);
      // result = await withCacheInvalidate(
      //   yarn ? addYarnDependencies : addNpmDependencies,
      //   `${req.headers['x-cache-id']}-${projectPath}-npm`,
      //   projectPathDecoded,
      //   dependenciesToInstall,
      //   type,
      // );
      res.status(200).json(null);
    }
  } else {
    res.status(400).json(null);
  }
}
