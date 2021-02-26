import type * as express from 'express';

import { executeCommandJSON } from '../../executeCommand';
import { getInstalledVersion, getLatestVersion } from '../../mapDependencies';
import { withCachePut } from '../../../cache';
import type * as Dependency from '../../../Dependency';
import type * as Commands from '../../../Commands';

async function getGlobalNpmDependencies(): Promise<Dependency.Entire[]> {
  const { dependencies: installedInfo } = await executeCommandJSON<Commands.Installed>(undefined, 'npm ls -g --depth=0 --json');

  const outdatedInfo = await executeCommandJSON<Commands.Outdated>(undefined, 'npm outdated -g --json');

  return Object.keys(installedInfo)
    .map((name): Dependency.Entire => ({
      repo: 'npm',
      name,
      type: 'global',
      installed: getInstalledVersion(installedInfo[name]),
      latest: getLatestVersion(getInstalledVersion(installedInfo[name]), null, outdatedInfo[name])
    }));
}

async function getGlobalNpmDependenciesSimple(): Promise<Dependency.Entire[]> {
  const { dependencies: installedInfo } = await executeCommandJSON<Commands.Installed>(undefined, 'npm ls -g --depth=0 --json');

  return Object.keys(installedInfo)
    .map((name): Dependency.Entire => ({
      repo: 'npm',
      name,
      type: 'global',
      installed: getInstalledVersion(installedInfo[name])
    }));
}

export async function getGlobalDependencies(
  _: unknown, res: express.Response<Dependency.Entire[]>
): Promise<void> {
  const npmDependencies = await withCachePut(getGlobalNpmDependencies, 'npm-global');

  res.json(npmDependencies);
}

export async function getGlobalDependenciesSimple(
  _: unknown, res: express.Response<Dependency.Entire[]>
): Promise<void> {
  const npmDependencies = await withCachePut(getGlobalNpmDependenciesSimple, 'npm-global-simple');

  res.json(npmDependencies);
}
