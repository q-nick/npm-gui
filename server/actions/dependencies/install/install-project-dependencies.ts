import path from 'path';
import { sync } from 'rimraf';

import type { Manager } from '../../../types/dependency.types';
import type { ResponserFunction } from '../../../types/new-server.types';
import { clearCache } from '../../../utils/cache';
import { executeCommandSimple } from '../../execute-command';

const clearManagerFiles = (projectPath: string): void => {
  sync(`${path.normalize(projectPath)}/node_modules`);
  sync(`${path.normalize(projectPath)}/yarn.lock`);
  sync(`${path.normalize(projectPath)}/package-lock.json`);
  sync(`${path.normalize(projectPath)}/pnpm-lock.yaml`);
};

// installation
const installNpmDependencies = async (
  projectPath: string,
  force: boolean,
): Promise<string> => {
  if (force) {
    clearManagerFiles(projectPath);
  }
  return executeCommandSimple(projectPath, 'npm install');
};

// installation
const installPnpmDependencies = async (
  projectPath: string,
  force: boolean,
): Promise<string> => {
  if (force) {
    clearManagerFiles(projectPath);
  }
  return executeCommandSimple(projectPath, 'pnpm install');
};

const installYarnDependencies = async (
  projectPath: string,
  force: boolean,
): Promise<void> => {
  if (force) {
    clearManagerFiles(projectPath);
  }

  await executeCommandSimple(projectPath, 'yarn install');
};

export const installDependenciesForceManager: ResponserFunction<
  unknown,
  { forceManager: Manager }
> = async ({
  params: { forceManager },
  extraParams: { projectPathDecoded, xCacheId },
}) => {
  if (forceManager === 'yarn') {
    await installYarnDependencies(projectPathDecoded, true);
  }

  if (forceManager === 'pnpm') {
    await installPnpmDependencies(projectPathDecoded, true);
  }

  if (forceManager === 'npm') {
    await installNpmDependencies(projectPathDecoded, true);
  }

  clearCache(xCacheId + projectPathDecoded);

  return {};
};

export const installDependencies: ResponserFunction = async ({
  extraParams: { projectPathDecoded, manager, xCacheId },
}) => {
  if (manager === 'yarn') {
    await installYarnDependencies(projectPathDecoded, true);
  }

  if (manager === 'pnpm') {
    await installPnpmDependencies(projectPathDecoded, true);
  }

  if (manager === 'npm') {
    await installNpmDependencies(projectPathDecoded, true);
  }

  clearCache(xCacheId + projectPathDecoded);

  return {};
};
