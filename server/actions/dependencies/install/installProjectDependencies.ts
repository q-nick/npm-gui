import * as rimraf from 'rimraf';
import * as path from 'path';
import type { Request, Response } from 'express';

import { executeCommandSimple } from '../../executeCommand';
import { clearCache } from '../../../utils/cache';

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

export async function installDependencies(
  req: Request<{ projectPathDecoded: string; force?: string }>, res: Response,
): Promise<void> {
  const { force } = req.params;

  if (req.yarnLock) {
    await installYarnDependencies(req.projectPathDecoded, force === 'force');
  } else {
    await installNpmDependencies(req.projectPathDecoded, force === 'force');
  }

  clearCache(req.projectPathDecoded);

  res.json({});
}
