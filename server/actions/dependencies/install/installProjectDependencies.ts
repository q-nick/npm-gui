import * as rimraf from 'rimraf';
import * as path from 'path';

import { executeCommandSimple } from '../../executeCommand';
import { clearCache } from '../../../utils/cache';
import type { ResponserFunction } from '../../../newServerTypes';

function clearManagerFiles(projectPath: string): void {
  rimraf.sync(`${path.normalize(projectPath)}/node_modules`);
  rimraf.sync(`${path.normalize(projectPath)}/yarn.lock`);
  rimraf.sync(`${path.normalize(projectPath)}/package-lock.json`);
}
// installation
async function installNpmDependencies(projectPath: string, force = false): Promise<string> {
  if (force) {
    clearManagerFiles(projectPath);
  }
  return executeCommandSimple(projectPath, 'npm install', true);
}

// installation
async function installPnpmDependencies(projectPath: string, force = false): Promise<string> {
  if (force) {
    clearManagerFiles(projectPath);
  }
  return executeCommandSimple(projectPath, 'pnpm install', true);
}

async function installYarnDependencies(projectPath: string, force = false): Promise<void> {
  if (force) {
    clearManagerFiles(projectPath);
  }

  await executeCommandSimple(projectPath, 'yarn install', true);
}

export const installDependencies: ResponserFunction = async (
  { params: { force }, extraParams: { projectPathDecoded, manager, xCacheId } },
) => {
  if (manager === 'yarn') {
    await installYarnDependencies(projectPathDecoded, force === 'force');
  } else if (manager === 'pnpm') {
    await installPnpmDependencies(projectPathDecoded, force === 'force');
  } else {
    await installNpmDependencies(projectPathDecoded, force === 'force');
  }

  clearCache(xCacheId + projectPathDecoded);

  return {};
};
