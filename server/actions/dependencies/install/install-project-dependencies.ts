import { existsSync, rmdirSync, rmSync } from 'fs';
import path from 'path';

import type { Manager } from '../../../types/dependency.types';
import type { ResponserFunction } from '../../../types/new-server.types';
import { clearCache } from '../../../utils/cache';
import { executeCommandSimple } from '../../execute-command';

const clearManagerFiles = (projectPath: string): void => {
  if (existsSync(`${path.normalize(projectPath)}/node_modules`)) {
    rmdirSync(`${path.normalize(projectPath)}/node_modules`, {
      recursive: true,
    });
  }

  for (const fileName of ['yarn.lock', 'package-lock.json', 'pnpm-lock.yaml']) {
    if (existsSync(`${path.normalize(projectPath)}/${fileName}`)) {
      rmSync(`${path.normalize(projectPath)}/${fileName}`);
    }
  }
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
  } else if (forceManager === 'pnpm') {
    await installPnpmDependencies(projectPathDecoded, true);
  } else {
    await installNpmDependencies(projectPathDecoded, true);
  }

  clearCache(xCacheId + forceManager + projectPathDecoded);

  return {};
};

export const installDependencies: ResponserFunction = async ({
  extraParams: { projectPathDecoded, manager = 'npm', xCacheId },
}) => {
  if (manager === 'yarn') {
    await installYarnDependencies(projectPathDecoded, false);
  } else if (manager === 'pnpm') {
    await installPnpmDependencies(projectPathDecoded, false);
  } else {
    await installNpmDependencies(projectPathDecoded, false);
  }

  clearCache(xCacheId + manager + projectPathDecoded);

  return {};
};
