import { executeCommandJSONWithFallback } from '../../executeCommand';
import { getInstalledVersion, getLatestVersion } from '../../../utils/mapDependencies';
import type * as Dependency from '../../../types/Dependency';
import type * as Commands from '../../../Commands';
import { getFromCache, putToCache } from '../../../utils/cache';
import type { ResponserFunction } from '../../../newServerTypes';

async function getGlobalNpmDependencies(): Promise<Dependency.Entire[]> {
  const { dependencies: installedInfo } = await executeCommandJSONWithFallback<Commands.Installed>(undefined, 'npm ls -g --depth=0 --json');
  if (!installedInfo) { return []; }

  const outdatedInfo = await executeCommandJSONWithFallback<Commands.Outdated>(undefined, 'npm outdated -g --json');

  return Object.keys(installedInfo)
    .map((name): Dependency.Entire => ({
      repo: 'npm',
      name,
      type: 'global',
      installed: getInstalledVersion(installedInfo[name]),
      latest: getLatestVersion(getInstalledVersion(installedInfo[name]), null, outdatedInfo[name]),
    }));
}

async function getGlobalNpmDependenciesSimple(): Promise<Dependency.Entire[]> {
  const { dependencies: installedInfo } = await executeCommandJSONWithFallback<Commands.Installed>(undefined, 'npm ls -g --depth=0 --json');
  if (!installedInfo) { return []; }

  return Object.keys(installedInfo)
    .map((name): Dependency.Entire => ({
      repo: 'npm',
      name,
      type: 'global',
      installed: getInstalledVersion(installedInfo[name]),
    }));
}

export const getGlobalDependencies: ResponserFunction = async () => {
  const cache = getFromCache('global');
  if (cache) { return cache; }

  const npmDependencies = await getGlobalNpmDependencies();
  putToCache('global', npmDependencies); // TODO cache-id

  return npmDependencies;
};

export const getGlobalDependenciesSimple: ResponserFunction = async () => {
  const npmDependencies = await getGlobalNpmDependenciesSimple();

  return npmDependencies;
};
