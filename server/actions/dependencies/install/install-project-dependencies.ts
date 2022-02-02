import path from 'path';
import { sync } from 'rimraf';

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

export const installDependencies: ResponserFunction<
  unknown,
  { forceManager: string }
> = async ({
  params: { forceManager },
  extraParams: { projectPathDecoded, manager, xCacheId },
}) => {
  switch (forceManager) {
    case 'yarn': {
      await installYarnDependencies(projectPathDecoded, true);

      break;
    }
    case 'pnpm': {
      await installPnpmDependencies(projectPathDecoded, true);

      break;
    }
    case 'npm': {
      await installNpmDependencies(projectPathDecoded, true);

      break;
    }
    default:
      if (manager === 'yarn') {
        await installYarnDependencies(projectPathDecoded, false);
      } else if (manager === 'pnpm') {
        await installPnpmDependencies(projectPathDecoded, false);
      } else {
        await installNpmDependencies(projectPathDecoded, false);
      }
  }

  clearCache(xCacheId + projectPathDecoded);

  return {};
};
