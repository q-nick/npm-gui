import type * as express from 'express';

import { executeCommandJSON, executeCommandJSONWithFallback } from '../../executeCommand';
import {
  getInstalledVersion,
  getLatestVersion,
  getWantedVersion,
  // mapYarnResultTableToVersion,
  // mapYarnResultTreeToBasic,
} from '../../../utils/mapDependencies';
import type * as Dependency from '../../../types/Dependency';
import type * as Commands from '../../../Commands';
import { getRequiredFromPackageJson, getTypeFromPackageJson } from '../../../utils/getProjectPackageJSON';
import { clearCache, updateInCache } from '../../../utils/cache';

async function getNpmPackageWithInfo(
  projectPath: string, dependencyName: string,
): Promise<Dependency.Entire> {
  // installed or not
  const { dependencies: installedInfo } = await executeCommandJSONWithFallback<Commands.Installed>(projectPath, `npm ls ${dependencyName} --depth=0 --json`);

  // latest, wanted
  const outdatedInfo = await executeCommandJSONWithFallback<Commands.Outdated>(projectPath, `npm outdated ${dependencyName} --json`);

  // required & type
  const type = getTypeFromPackageJson(projectPath, dependencyName);
  const required = getRequiredFromPackageJson(projectPath, dependencyName);

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
    type: Dependency.Type; }, unknown, Dependency.Basic[]>,
  res: express.Response<null>,
): Promise<void> {
  const { type } = req.params;

  const dependenciesToInstall = req.body.filter((d) => d.name);
  const ONE = 1;

  if (dependenciesToInstall.length === ONE) {
    const result = await addNpmDependency(req.projectPathDecoded, dependenciesToInstall[0]!, type); // eslint-disable-line
    updateInCache(req.projectPathDecoded, result);
  } else if (dependenciesToInstall.length > ONE) {
    await addNpmDependencies(req.projectPathDecoded, dependenciesToInstall, type);
    clearCache(req.projectPathDecoded);
  }

  res.json(null);
}
