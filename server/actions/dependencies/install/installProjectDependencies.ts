import * as rimraf from 'rimraf';
import * as path from 'path';

import { executeCommandSimple } from '../../executeCommand';
import { clearCache } from '../../../utils/cache';
import type { ResponserFunction } from '../../../newServerTypes';

// installation
async function installNpmDependencies(projectPath: string, force = false): Promise<string> {
  if (force) {
    rimraf.sync(`${path.normalize(projectPath)}/node_modules`);
    rimraf.sync(`${path.normalize(projectPath)}/yarn.lock`);
    rimraf.sync(`${path.normalize(projectPath)}/package-lock.json`);
  }
  return executeCommandSimple(projectPath, 'npm install', true);
}

async function installYarnDependencies(projectPath: string, force = false): Promise<void> {
  if (force) {
    rimraf.sync(`${path.normalize(projectPath)}/node_modules`);
    rimraf.sync(`${path.normalize(projectPath)}/yarn.lock`);
    rimraf.sync(`${path.normalize(projectPath)}/package-lock.json`);
  }

  await executeCommandSimple(projectPath, 'yarn install', true);
}

export const installDependencies: ResponserFunction = async (
  { params: { force }, extraParams: { projectPathDecoded, yarnLock, xCacheId } },
) => {
  if (yarnLock) {
    await installYarnDependencies(projectPathDecoded, force === 'force');
  } else {
    await installNpmDependencies(projectPathDecoded, force === 'force');
  }

  clearCache(xCacheId + projectPathDecoded);

  return {};
};
