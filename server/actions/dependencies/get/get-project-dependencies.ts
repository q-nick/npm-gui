/* eslint-disable max-lines */
import type { Installed, Outdated } from '../../../types/commands.types';
import type {
  DependencyBase,
  DependencyInstalled,
  Manager,
} from '../../../types/dependency.types';
import type { ResponserFunction } from '../../../types/new-server.types';
import type { InstalledPNPM } from '../../../types/pnpm.types';
import type { InstalledYarn, OutdatedYarn } from '../../../types/yarn.types';
import { getFromCache, putToCache } from '../../../utils/cache';
import {
  getAllDependenciesFromPackageJsonAsArray,
  getDependenciesFromPackageJson,
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

const getAllDependenciesSimpleJSON = (
  projectPath: string,
  manager: Manager,
): DependencyBase[] => {
  return getAllDependenciesFromPackageJsonAsArray(projectPath, manager);
};

const getAllNpmDependencies = async (
  projectPath: string,
): Promise<DependencyInstalled[]> => {
  const { dependencies: installedInfo } =
    await executeCommandJSONWithFallback<Installed>(
      projectPath,
      'npm ls --depth=0 --json',
    );
  // latest, wanted
  const outdatedInfo = await executeCommandJSONWithFallback<Outdated>(
    projectPath,
    'npm outdated --json',
  );

  // extraneous
  const extraneousInstalled = installedInfo
    ? Object.keys(installedInfo).filter((name) => {
        const depInfo = installedInfo[name];
        return depInfo && 'extraneous' in depInfo;
      })
    : [];

  const allDependencies: DependencyBase[] = [
    ...getAllDependenciesFromPackageJsonAsArray(projectPath, 'npm'),
    ...extraneousInstalled.map(
      (name): DependencyBase => ({
        name,
        type: 'extraneous',
        required: undefined,
        manager: 'npm',
      }),
    ),
  ];

  return allDependencies.map((dependency): DependencyInstalled => {
    const installed = getInstalledVersion(
      installedInfo ? installedInfo[dependency.name] : undefined,
    );
    const wanted = getWantedVersion(installed, outdatedInfo[dependency.name]);
    const latest = getLatestVersion(
      installed,
      wanted,
      outdatedInfo[dependency.name],
    );

    return {
      ...dependency,
      installed,
      wanted,
      latest,
    };
  });
};

const getAllPnpmDependencies = async (
  projectPath: string,
): Promise<DependencyInstalled[]> => {
  // type
  const dependencies = getDependenciesFromPackageJson(projectPath);

  const [
    {
      devDependencies: installedInfoDevelopment,
      dependencies: installedInfoRegular,
    },
  ] = await executeCommandJSONWithFallback<InstalledPNPM>(
    projectPath,
    'pnpm ls --depth=0 --json',
  );
  const installedInfo = {
    ...installedInfoDevelopment,
    ...installedInfoRegular,
  };

  // latest, wanted
  const outdatedInfo: Outdated = {};
  await executePnpmOutdated(outdatedInfo, projectPath);
  await executePnpmOutdated(outdatedInfo, projectPath, true);

  // extraneous
  const extraneousInstalled = Object.keys(installedInfo).filter((name) => {
    const depInfo = dependencies[name];
    return !depInfo;
  });

  const allDependencies: DependencyBase[] = [
    ...getAllDependenciesFromPackageJsonAsArray(projectPath, 'pnpm'),
    ...extraneousInstalled.map(
      (name): DependencyBase => ({
        name,
        type: 'extraneous',
        manager: 'pnpm',
        required: undefined,
      }),
    ),
  ];

  return allDependencies.map((dependency) => {
    const installed = getInstalledVersion(installedInfo[dependency.name]);
    const wanted = getWantedVersion(installed, outdatedInfo[dependency.name]);
    const latest = getLatestVersion(
      installed,
      wanted,
      outdatedInfo[dependency.name],
    );

    return {
      ...dependency,
      installed,
      wanted,
      latest,
    };
  });
};

const getAllYarnDependencies = async (
  projectPath: string,
): Promise<DependencyInstalled[]> => {
  // type
  const anyError = await executeCommandJSONWithFallbackYarn<string | undefined>(
    projectPath,
    'yarn check --json',
  );
  if (anyError !== undefined) {
    // there is some error in repo, we cant extract correct information
    return getAllDependenciesSimpleJSON(projectPath, 'yarn').map((dep) => ({
      ...dep,
      installed: null,
      wanted: null,
      latest: null,
    }));
  }

  const {
    data: { trees: installedInfo },
  } = await executeCommandJSONWithFallback<InstalledYarn>(
    projectPath,
    'yarn list --depth=0 --json',
  );

  await executeCommandSimple(projectPath, 'yarn list --depth=0 --json');

  const outdatedInfo = await executeCommandJSONWithFallbackYarn<
    OutdatedYarn | undefined
  >(projectPath, 'yarn outdated --json');
  const outdatedInfoExtracted = extractVersionFromYarnOutdated(outdatedInfo);

  const allDependencies = getAllDependenciesFromPackageJsonAsArray(
    projectPath,
    'yarn',
  );

  return allDependencies.map((dependency) => {
    const info = installedInfo.find(
      (x) => x.name.split('@')[0] === dependency.name,
    );
    const installed = info?.name.split('@')[1];

    const wanted = getWantedVersion(
      installed,
      outdatedInfoExtracted[dependency.name],
    );
    const latest = getLatestVersion(
      installed,
      wanted,
      outdatedInfoExtracted[dependency.name],
    );

    return {
      ...dependency,
      installed,
      wanted,
      latest,
    };
  });
};

export const getAllDependenciesSimple: ResponserFunction<
  unknown,
  unknown,
  DependencyBase[]
> = ({ extraParams: { projectPathDecoded, manager } }) => {
  const dependencies = getAllDependenciesSimpleJSON(
    projectPathDecoded,
    manager,
  );

  return dependencies;
};

export const getAllDependencies: ResponserFunction<
  unknown,
  unknown,
  DependencyInstalled[]
> = async ({ extraParams: { projectPathDecoded, manager, xCacheId } }) => {
  const cache = getFromCache(xCacheId + manager + projectPathDecoded);

  if (cache) {
    return cache;
  }

  let dependencies: DependencyInstalled[] = [];

  try {
    if (manager === 'yarn') {
      dependencies = await getAllYarnDependencies(projectPathDecoded);
    } else if (manager === 'pnpm') {
      dependencies = await getAllPnpmDependencies(projectPathDecoded);
    } else {
      dependencies = await getAllNpmDependencies(projectPathDecoded);
    }
  } catch {
    return [];
  }

  putToCache(xCacheId + manager + projectPathDecoded, dependencies);

  return dependencies;
};
