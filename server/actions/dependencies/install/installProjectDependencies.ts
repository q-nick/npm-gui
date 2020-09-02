import * as rimraf from 'rimraf';
import * as path from 'path';
import * as express from 'express';

import executeCommand from '../../executeCommand';
import { withCacheInvalidate } from '../../../cache';
import { decodePath } from '../../decodePath';
import { hasYarn, hasNpm, hasBower } from '../../hasYarn';

// installation
async function installNpmDependencies(projectPath: string):Promise<void> {
  await executeCommand(projectPath, 'npm install', true);
}

async function installYarnDependencies(projectPath: string):Promise<void> {
  await executeCommand(projectPath, 'yarn install', true);
}

async function installBowerDependencies(projectPath: string):Promise<void> {
  await executeCommand(projectPath, 'bower install', true);
}

// force
async function forceReinstallYarnDependencies(projectPath: string):Promise<void> {
  rimraf.sync(`${path.normalize(projectPath)}/node_modules`);
  rimraf.sync(`${path.normalize(projectPath)}/yarn-lock.json`);
  await executeCommand(projectPath, 'yarn install', true);
}

async function forceReinstallNpmDependencies(projectPath: string):Promise<void> {
  rimraf.sync(`${path.normalize(projectPath)}/node_modules`);
  rimraf.sync(`${path.normalize(projectPath)}/package-lock.json`);
  await executeCommand(projectPath, 'npm install', true);
}

async function forceReinstallBowerDependencies(projectPath: string):Promise<void> {
  rimraf.sync(`${path.normalize(projectPath)}/bower_components`);
  await executeCommand(projectPath, 'bower install', true);
}

export async function installDependencies(
  req:express.Request, res:express.Response,
):Promise<void> {
  const { projectPath } = req.params as { projectPath: string };
  const projectPathDecoded = decodePath(projectPath)!;
  const yarn = hasYarn(projectPathDecoded);
  const npm = hasNpm(projectPathDecoded);
  const bower = hasBower(projectPathDecoded);

  if (yarn || npm) {
    try {
      await withCacheInvalidate(
        yarn ? installYarnDependencies : installNpmDependencies,
        `${req.headers['x-cache-id']}-${projectPath}-npm`,
        projectPathDecoded,
      );
    } catch (e) {
      console.error('npm/yarn', e);
    }
  }

  if (bower) {
    try {
      await withCacheInvalidate(
        installBowerDependencies,
        `${req.headers['x-cache-id']}-${projectPath}-bower`,
        projectPathDecoded,
      );
    } catch (e) {
      console.error('bower', e);
    }
  }

  res.json({});
}

export async function forceReinstallDependencies(
  req:express.Request, res:express.Response,
):Promise<void> {
  const { projectPath } = req.params as { projectPath: string };
  const projectPathDecoded = decodePath(projectPath)!;
  const yarn = hasYarn(projectPathDecoded);
  const npm = hasNpm(projectPathDecoded);
  const bower = hasBower(projectPathDecoded);

  if (yarn || npm) {
    try {
      await withCacheInvalidate(
        yarn ? forceReinstallYarnDependencies : forceReinstallNpmDependencies,
        `${req.headers['x-cache-id']}-${projectPath}-npm`,
        projectPathDecoded,
      );
    } catch (e) {
      console.error('npm/yarn', e);
    }
  }

  if (bower) {
    try {
      await withCacheInvalidate(
        forceReinstallBowerDependencies,
        `${req.headers['x-cache-id']}-${projectPath}-bower`,
        projectPathDecoded,
      );
    } catch (e) {
      console.error('bower', e);
    }
  }

  res.json({});
}
