import type { Installed, Outdated } from '../../../types/commands.types';
import type {
  DependencyBase,
  DependencyInstalled,
} from '../../../types/dependency.types';
import type { ResponserFunction } from '../../../types/new-server.types';
import { getFromCache, putToCache } from '../../../utils/cache';
import {
  getInstalledVersion,
  getLatestVersion,
} from '../../../utils/map-dependencies';
import { executeCommandJSONWithFallback } from '../../execute-command';

const getGlobalNpmDependencies = async (): Promise<DependencyInstalled[]> => {
  const { dependencies: installedInfo } =
    await executeCommandJSONWithFallback<Installed>(
      undefined,
      'npm ls -g --depth=0 --json',
    );
  if (!installedInfo) {
    return [];
  }

  const outdatedInfo = await executeCommandJSONWithFallback<Outdated>(
    undefined,
    'npm outdated -g --json',
  );

  return Object.keys(installedInfo).map(
    (name): DependencyInstalled => ({
      manager: 'npm',
      name,
      type: 'global',
      installed: getInstalledVersion(installedInfo[name]),
      latest: getLatestVersion(
        getInstalledVersion(installedInfo[name]),
        null,
        outdatedInfo[name],
      ),
    }),
  );
};

const getGlobalNpmDependenciesSimple = async (): Promise<DependencyBase[]> => {
  const { dependencies: installedInfo } =
    await executeCommandJSONWithFallback<Installed>(
      undefined,
      'npm ls -g --depth=0 --json',
    );
  if (!installedInfo) {
    return [];
  }

  return Object.keys(installedInfo).map((name) => ({
    manager: 'npm',
    name,
    type: 'global',
    installed: getInstalledVersion(installedInfo[name]),
  }));
};

export const getGlobalDependencies: ResponserFunction = async ({
  extraParams: { xCacheId },
}) => {
  const cache = getFromCache(`${xCacheId}global`);
  if (cache) {
    return cache;
  }

  const npmDependencies = await getGlobalNpmDependencies();
  putToCache(`${xCacheId}global`, npmDependencies);
  // TODO cache-id

  return npmDependencies;
};

export const getGlobalDependenciesSimple: ResponserFunction = async () => {
  const npmDependencies = await getGlobalNpmDependenciesSimple();

  return npmDependencies;
};
