import type * as CommandsYarn from '../../../CommandsYarn';

import { executeCommandJSONWithFallback, executeCommandJSONWithFallbackYarn, executeCommandSimple } from '../../executeCommand';
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
import { extractVersionFromYarnOutdated } from '../../yarn-utils';
import type { ResponserFunction } from '../../../newServerTypes';

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

async function getYarnPackageWithInfo(
  projectPath: string, dependencyName: string,
): Promise<Dependency.Entire> {
  // installed or not
  const { data: { trees: installedInfo } } = await executeCommandJSONWithFallback<CommandsYarn.Installed>(projectPath, `yarn list --pattern ${dependencyName} --depth=0 --json`);

  // latest, wanted
  const outdatedInfo = await executeCommandJSONWithFallbackYarn<CommandsYarn.Outdated | undefined>(projectPath, `yarn outdated ${dependencyName} --json`);
  const outdatedInfoExtracted = extractVersionFromYarnOutdated(outdatedInfo);

  // required & type
  const type = getTypeFromPackageJson(projectPath, dependencyName);
  const required = getRequiredFromPackageJson(projectPath, dependencyName);

  const info = installedInfo.find((x) => x.name.split('@')[0] === dependencyName);
  const installed = info?.name.split('@')[1];

  const wanted = getWantedVersion(installed, outdatedInfoExtracted[dependencyName]);
  const latest = getLatestVersion(installed, wanted, outdatedInfoExtracted[dependencyName]);

  return {
    repo: 'yarn',
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
  await executeCommandSimple(projectPath, `npm install ${dependency.name}@${dependency.version ?? ''} -${type === 'prod' ? 'P' : 'D'}`, true);
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
  await executeCommandSimple(projectPath, command, true);
}

async function addYarnDependency(
  projectPath: string, dependency: Dependency.Basic, type: Dependency.Type,
): Promise<Dependency.Entire> {
  // add
  await executeCommandSimple(projectPath, `yarn add ${dependency.name}@${dependency.version ?? ''}${type === 'prod' ? '' : ' -D'}`, true);
  // here is a change, we change param -S
  // to -P in case to move dependency from dev to regular(prod?)?

  return getYarnPackageWithInfo(projectPath, dependency.name);
}

async function addYarnDependencies(
  projectPath: string, dependencies: Dependency.Basic[], type: Dependency.Type,
): Promise<void> {
  // add list
  const dependenciesToInstall = dependencies.map((d) => `${d.name}@${d.version ?? ''}`);
  const command = `yarn add ${dependenciesToInstall.join(' ')}${type === 'prod' ? '' : ' -D'}`;
  await executeCommandSimple(projectPath, command, true);
}

export const addDependencies: ResponserFunction<{ name: string }[]> = async (
  { params: { type }, extraParams: { projectPathDecoded, yarnLock, xCacheId }, body },
) => {
  if (type === undefined) { throw new Error(' no type'); }
  const dependenciesToInstall = body.filter((d) => d.name);
  const ONE = 1;

  if (dependenciesToInstall.length === ONE) {
    const result = yarnLock
      ? await addYarnDependency(projectPathDecoded, dependenciesToInstall[0]!, type as Dependency.Type) // eslint-disable-line
      : await addNpmDependency(projectPathDecoded, dependenciesToInstall[0]!, type as Dependency.Type); // eslint-disable-line
    updateInCache(xCacheId + projectPathDecoded, result);
  } else if (dependenciesToInstall.length > ONE) {
    if (yarnLock) {
      await addYarnDependencies(projectPathDecoded, dependenciesToInstall, type as Dependency.Type);
    } else {
      await addNpmDependencies(projectPathDecoded, dependenciesToInstall, type as Dependency.Type);
    }
    clearCache(xCacheId + projectPathDecoded);
  }

  return {};
};
