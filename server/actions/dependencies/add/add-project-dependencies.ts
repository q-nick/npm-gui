/* eslint-disable max-lines */
import type { Installed, Outdated } from '../../../types/commands.types';
import type {
  Basic,
  DependencyInstalled,
  Type,
} from '../../../types/dependency.types';
import type { ResponserFunction } from '../../../types/new-server.types';
import type { InstalledPNPM } from '../../../types/pnpm.types';
import type { InstalledYarn, OutdatedYarn } from '../../../types/yarn.types';
import { clearCache, updateInCache } from '../../../utils/cache';
import {
  getRequiredFromPackageJson,
  getTypeFromPackageJson,
} from '../../../utils/get-project-package-json';
import {
  getInstalledVersion,
  getLatestVersion,
  getWantedVersion,
} from '../../../utils/map-dependencies';
import {
  executeCommandJSONWithFallback,
  executeCommandJSONWithFallbackYarn,
  executeCommandSimple,
} from '../../execute-command';
import { executePnpmOutdated } from '../../pnpm-utils';
import { extractVersionFromYarnOutdated } from '../../yarn-utils';

const getNpmPackageWithInfo = async (
  projectPath: string,
  dependencyName: string,
): Promise<DependencyInstalled> => {
  // installed or not
  const { dependencies: installedInfo } =
    await executeCommandJSONWithFallback<Installed>(
      projectPath,
      `npm ls ${dependencyName} --depth=0 --json`,
    );

  // latest, wanted
  const outdatedInfo = await executeCommandJSONWithFallback<Outdated>(
    projectPath,
    `npm outdated ${dependencyName} --json`,
  );

  // required & type
  const type = getTypeFromPackageJson(projectPath, dependencyName);
  const required = getRequiredFromPackageJson(projectPath, dependencyName);

  const installed = getInstalledVersion(
    installedInfo ? installedInfo[dependencyName] : undefined,
  );
  const wanted = getWantedVersion(installed, outdatedInfo[dependencyName]);
  const latest = getLatestVersion(
    installed,
    wanted,
    outdatedInfo[dependencyName],
  );

  return {
    manager: 'npm',
    required,
    name: dependencyName,
    type,
    installed,
    wanted,
    latest,
  };
};

const getPnpmPackageWithInfo = async (
  projectPath: string,
  dependencyName: string,
): Promise<DependencyInstalled> => {
  // installed or not
  const [
    {
      devDependencies: installedInfoDevelopment,
      dependencies: installedInfoRegular,
    },
  ] = await executeCommandJSONWithFallback<InstalledPNPM>(
    projectPath,
    `pnpm ls ${dependencyName} --depth=0 --json`,
  );
  const installedInfo = {
    ...installedInfoDevelopment,
    ...installedInfoRegular,
  };

  // latest, wanted
  const outdatedInfo: Outdated = {};
  await executePnpmOutdated(outdatedInfo, projectPath);
  await executePnpmOutdated(outdatedInfo, projectPath, true);

  // required & type
  const type = getTypeFromPackageJson(projectPath, dependencyName);
  const required = getRequiredFromPackageJson(projectPath, dependencyName);

  const installed = getInstalledVersion(installedInfo[dependencyName]);
  const wanted = getWantedVersion(installed, outdatedInfo[dependencyName]);
  const latest = getLatestVersion(
    installed,
    wanted,
    outdatedInfo[dependencyName],
  );

  return {
    manager: 'pnpm',
    required,
    name: dependencyName,
    type,
    installed,
    wanted,
    latest,
  };
};

const getYarnPackageWithInfo = async (
  projectPath: string,
  dependencyName: string,
): Promise<DependencyInstalled> => {
  // installed or not
  const {
    data: { trees: installedInfo },
  } = await executeCommandJSONWithFallback<InstalledYarn>(
    projectPath,
    `yarn list --pattern ${dependencyName} --depth=0 --json`,
  );

  // latest, wanted
  const outdatedInfo = await executeCommandJSONWithFallbackYarn<
    OutdatedYarn | undefined
  >(projectPath, `yarn outdated ${dependencyName} --json`);
  const outdatedInfoExtracted = extractVersionFromYarnOutdated(outdatedInfo);

  // required & type
  const type = getTypeFromPackageJson(projectPath, dependencyName);
  const required = getRequiredFromPackageJson(projectPath, dependencyName);

  const info = installedInfo.find(
    (x) => x.name.split('@')[0] === dependencyName,
  );
  const installed = info?.name.split('@')[1];

  const wanted = getWantedVersion(
    installed,
    outdatedInfoExtracted[dependencyName],
  );
  const latest = getLatestVersion(
    installed,
    wanted,
    outdatedInfoExtracted[dependencyName],
  );

  return {
    manager: 'yarn',
    required,
    name: dependencyName,
    type,
    installed,
    wanted,
    latest,
  };
};

const addNpmDependencies = async (
  projectPath: string,
  dependencies: Basic[],
  type: Type,
): Promise<DependencyInstalled | undefined> => {
  // add list
  const dependenciesToInstall = dependencies.map(
    (d) => `${d.name}${d.version ? `@${d.version}` : ''}`,
  );
  const command = `npm install ${dependenciesToInstall.join(' ')} -${
    type === 'prod' ? 'P' : 'D'
  } --json`;
  await executeCommandSimple(projectPath, command);

  if (dependencies.length === 1 && dependencies[0]) {
    return getNpmPackageWithInfo(projectPath, dependencies[0].name);
  }

  return undefined;
};

const addPnpmDependencies = async (
  projectPath: string,
  dependencies: Basic[],
  type: Type,
): Promise<DependencyInstalled | undefined> => {
  // add list
  const dependenciesToInstall = dependencies.map(
    (d) => `${d.name}${d.version ? `@${d.version}` : ''}`,
  );
  const command = `pnpm install ${dependenciesToInstall.join(' ')} -${
    type === 'prod' ? 'P' : 'D'
  }`;
  await executeCommandSimple(projectPath, command);

  if (dependencies.length === 1 && dependencies[0]) {
    return getPnpmPackageWithInfo(projectPath, dependencies[0].name);
  }

  return undefined;
};

const addYarnDependencies = async (
  projectPath: string,
  dependencies: Basic[],
  type: Type,
): Promise<DependencyInstalled | undefined> => {
  // add list
  const dependenciesToInstall = dependencies.map(
    (d) => `${d.name}${d.version ? `@${d.version}` : ''}`,
  );
  const command = `yarn add ${dependenciesToInstall.join(' ')}${
    type === 'prod' ? '' : ' -D'
  }`;
  await executeCommandSimple(projectPath, command);

  if (dependencies.length === 1 && dependencies[0]) {
    return getYarnPackageWithInfo(projectPath, dependencies[0].name);
  }

  return undefined;
};

export const addDependencies: ResponserFunction<
  { name: string }[],
  { type: Type }
  // eslint-disable-next-line max-statements
> = async ({
  params: { type },
  extraParams: { projectPathDecoded, manager, xCacheId },
  body,
}) => {
  let singleAddUpdate: DependencyInstalled | undefined = undefined;

  if (manager === 'yarn') {
    singleAddUpdate = await addYarnDependencies(projectPathDecoded, body, type);
  } else if (manager === 'pnpm') {
    singleAddUpdate = await addPnpmDependencies(projectPathDecoded, body, type);
  } else {
    singleAddUpdate = await addNpmDependencies(projectPathDecoded, body, type);
  }

  if (singleAddUpdate) {
    updateInCache(xCacheId + manager + projectPathDecoded, singleAddUpdate);
  } else {
    clearCache(xCacheId + manager + projectPathDecoded);
  }

  return {};
};
