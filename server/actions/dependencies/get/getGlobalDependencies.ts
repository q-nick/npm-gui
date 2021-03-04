import type { Response } from 'express';

import { executeCommandJSONWithFallback } from '../../executeCommand';
import { getInstalledVersion, getLatestVersion } from '../../../utils/mapDependencies';
import type * as Dependency from '../../../types/Dependency';
import type * as Commands from '../../../Commands';
import { getFromCache, putToCache } from '../../../utils/cache';

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

export async function getGlobalDependencies(
  _: unknown, res: Response<Dependency.Entire[]>,
): Promise<void> {
  const cache = getFromCache('global');
  if (cache) { res.json(cache); return; }

  const npmDependencies = await getGlobalNpmDependencies();
  putToCache('global', npmDependencies); // TODO cache-id

  res.json(npmDependencies);
}

export async function getGlobalDependenciesSimple(
  _: unknown, res: Response<Dependency.Entire[]>,
): Promise<void> {
  const npmDependencies = await getGlobalNpmDependenciesSimple();

  res.json(npmDependencies);
}
