import * as rimraf from 'rimraf';
import * as path from 'path';
import * as express from 'express';

import executeCommand, { executeCommandJSON } from '../../executeCommand';
import { putToCache } from '../../../cache';
import { decodePath } from '../../decodePath';
import { hasYarn, hasNpm } from '../../hasYarn';

// installation
async function installNpmDependencies(projectPath: string, force = false):Promise<void> {
  if (force) {
    rimraf.sync(`${path.normalize(projectPath)}/node_modules`);
    rimraf.sync(`${path.normalize(projectPath)}/yarn-lock.json`);
  }
  const result = await executeCommandJSON<Commands.Install>(projectPath, 'npm install --json', true);
  if('error' in result) {
    throw result.error.summary;
  }
}

async function installYarnDependencies(projectPath: string, force = false):Promise<void> {
  if (force) {
    rimraf.sync(`${path.normalize(projectPath)}/node_modules`);
    rimraf.sync(`${path.normalize(projectPath)}/yarn-lock.json`);
  }

  await executeCommand(projectPath, 'yarn install', true);
}

export async function installDependencies(
  req:express.Request, res:express.Response,
):Promise<void> {
  const { projectPath, force } = req.params as { projectPath: string, force: string };
  const projectPathDecoded = decodePath(projectPath);
  const yarn = hasYarn(projectPathDecoded);
  const npm = hasNpm(projectPathDecoded);

  if (yarn || npm) {
    if(yarn) {
      await installYarnDependencies(projectPathDecoded, force === 'force');
    } else {
      await installNpmDependencies(projectPathDecoded, force === 'force');
    }
    putToCache(`${req.headers['x-cache-id']}-${projectPath}-npm`, null);
  } else {
    throw 'no yarn or npm in project';
  }

  res.json({});
}
