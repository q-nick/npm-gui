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
    `pnpm ls ${dependencyName} --depth=0 --json=`,
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

const addNpmDependency = async (
  projectPath: string,
  dependency: Basic,
  type: Type,
): Promise<DependencyInstalled> => {
  // add
  await executeCommandSimple(
    projectPath,
    `npm install ${dependency.name}@${dependency.version ?? ''} -${
      type === 'prod' ? 'P' : 'D'
    }`,
  );
  // here is a change, we change param -S
  // to -P in case to move dependency from dev to regular(prod?)?

  return getNpmPackageWithInfo(projectPath, dependency.name);
};

const addNpmDependencies = async (
  projectPath: string,
  dependencies: Basic[],
  type: Type,
): Promise<void> => {
  // add list
  const dependenciesToInstall = dependencies.map(
    (d) => `${d.name}@${d.version ?? ''}`,
  );
  const command = `npm install ${dependenciesToInstall.join(' ')} -${
    type === 'prod' ? 'P' : 'D'
  } --json`;
  await executeCommandSimple(projectPath, command);
};

const addPnpmDependency = async (
  projectPath: string,
  dependency: Basic,
  type: Type,
): Promise<DependencyInstalled> => {
  // add
  await executeCommandSimple(
    projectPath,
    `pnpm install ${dependency.name}@${dependency.version ?? ''} -${
      type === 'prod' ? 'P' : 'D'
    }`,
  );
  // here is a change, we change param -S
  // to -P in case to move dependency from dev to regular(prod?)?

  return getPnpmPackageWithInfo(projectPath, dependency.name);
};

const addPnpmDependencies = async (
  projectPath: string,
  dependencies: Basic[],
  type: Type,
): Promise<void> => {
  // add list
  const dependenciesToInstall = dependencies.map(
    (d) => `${d.name}@${d.version ?? ''}`,
  );
  const command = `pnpm install ${dependenciesToInstall.join(' ')} -${
    type === 'prod' ? 'P' : 'D'
  }`;
  await executeCommandSimple(projectPath, command);
};

const addYarnDependency = async (
  projectPath: string,
  dependency: Basic,
  type: Type,
): Promise<DependencyInstalled> => {
  // add
  await executeCommandSimple(
    projectPath,
    `yarn add ${dependency.name}@${dependency.version ?? ''}${
      type === 'prod' ? '' : ' -D'
    }`,
  );
  // here is a change, we change param -S
  // to -P in case to move dependency from dev to regular(prod?)?

  return getYarnPackageWithInfo(projectPath, dependency.name);
};

const addYarnDependencies = async (
  projectPath: string,
  dependencies: Basic[],
  type: Type,
): Promise<void> => {
  // add list
  const dependenciesToInstall = dependencies.map(
    (d) => `${d.name}@${d.version ?? ''}`,
  );
  const command = `yarn add ${dependenciesToInstall.join(' ')}${
    type === 'prod' ? '' : ' -D'
  }`;
  await executeCommandSimple(projectPath, command);
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
  const dependenciesToInstall = body.filter((d) => d.name);

  const singleDepedency =
    dependenciesToInstall.length === 1 && dependenciesToInstall[0];

  if (singleDepedency) {
    if (manager === 'yarn') {
      const result = await addYarnDependency(
        projectPathDecoded,
        singleDepedency,
        type,
      );
      updateInCache(xCacheId + projectPathDecoded, result);
    } else if (manager === 'pnpm') {
      const result = await addPnpmDependency(
        projectPathDecoded,
        singleDepedency,
        type,
      );
      updateInCache(xCacheId + projectPathDecoded, result);
    } else {
      const result = await addNpmDependency(
        projectPathDecoded,
        singleDepedency,
        type,
      );
      updateInCache(xCacheId + projectPathDecoded, result);
    }
  } else if (dependenciesToInstall.length > 1) {
    if (manager === 'yarn') {
      await addYarnDependencies(
        projectPathDecoded,
        dependenciesToInstall,
        type,
      );
    } else if (manager === 'pnpm') {
      await addPnpmDependencies(
        projectPathDecoded,
        dependenciesToInstall,
        type,
      );
    } else {
      await addNpmDependencies(projectPathDecoded, dependenciesToInstall, type);
    }
    clearCache(xCacheId + projectPathDecoded);
  }

  return {};
};
