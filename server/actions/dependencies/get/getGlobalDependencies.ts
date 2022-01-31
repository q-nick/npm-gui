import type { Installed, Outdated } from '../../../Commands';
import type { ResponserFunction } from '../../../newServerTypes';
import type { Entire } from '../../../types/Dependency';
import { getFromCache, putToCache } from '../../../utils/cache';
import {
  getInstalledVersion,
  getLatestVersion,
} from '../../../utils/mapDependencies';
import { executeCommandJSONWithFallback } from '../../executeCommand';

const getGlobalNpmDependencies = async (): Promise<Entire[]> => {
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
    (name): Entire => ({
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

const getGlobalNpmDependenciesSimple = async (): Promise<Entire[]> => {
  const { dependencies: installedInfo } =
    await executeCommandJSONWithFallback<Installed>(
      undefined,
      'npm ls -g --depth=0 --json',
    );
  if (!installedInfo) {
    return [];
  }

  return Object.keys(installedInfo).map(
    (name): Entire => ({
      manager: 'npm',
      name,
      type: 'global',
      installed: getInstalledVersion(installedInfo[name]),
    }),
  );
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
