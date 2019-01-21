import * as rimraf from 'rimraf';
import * as path from 'path';
import * as express from 'express';

import executeCommand from '../../executeCommand';
import { clearCache } from '../../../cache';
import { decodePath } from '../../decodePath';

async function installAsIsRegularNpmDependency(req:express.Request):Promise<void> {
  const projectPath = decodePath(req.params.projectPath);

  // add
  await executeCommand(projectPath, 'npm install --only=prod', true);
}

async function installAsIsDevNpmDependency(req:express.Request):Promise<void> {
  const projectPath = decodePath(req.params.projectPath);

  // add
  await executeCommand(projectPath, 'npm install --only=dev', true);
}

async function forceReinstallNpmDependency(req:express.Request):Promise<void> {
  const projectPath = decodePath(req.params.projectPath);
  rimraf.sync(`${path.normalize(projectPath)}/node_modules`);
  rimraf.sync(`${path.normalize(projectPath)}/package-lock.json`);
  // add
  await executeCommand(projectPath, 'npm install --force', true);
}

async function installAsIsRegularBowerDependency(
  _:express.Request):Promise<void> {
}

async function installAsIsDevBowerDependency(
  _:express.Request):Promise<void> {
}

async function forceReinstallBowerDependency(
  _:express.Request):Promise<void> {
}

export async function installAsIsRegularDependencies(
  req:express.Request, res:express.Response):Promise<void> {
  const npmCacheNameRegular = `${req.params.projectPath}-npmRegular`;
  const bowerCacheNameRegular = `${req.params.projectPath}-bowerRegular`;

  if (req.params.repoName === 'npm') {
    await installAsIsRegularNpmDependency(req);
    clearCache(npmCacheNameRegular);
    clearCache(bowerCacheNameRegular);
  } else if (req.params.repoName === 'bower') {
    await installAsIsRegularBowerDependency(req);
    clearCache(npmCacheNameRegular);
    clearCache(bowerCacheNameRegular);
  }

  res.json({});
}

export async function installAsIsDevDependencies(
  req:express.Request, res:express.Response):Promise<void> {
  const npmCacheNameDev = `${req.params.projectPath}-npmDev`;
  const bowerCacheNameDev = `${req.params.projectPath}-bowerDev`;

  if (req.params.repoName === 'npm') {
    await installAsIsDevNpmDependency(req);
    clearCache(npmCacheNameDev);
    clearCache(bowerCacheNameDev);
  } else if (req.params.repoName === 'bower') {
    await installAsIsDevBowerDependency(req);
    clearCache(npmCacheNameDev);
    clearCache(bowerCacheNameDev);
  }

  res.json({});
}

export async function forceReinstallDependencies(
  req:express.Request, res:express.Response):Promise<void> {
  try {
    await forceReinstallNpmDependency(req);
  } catch (e) { console.error(e); }
  try {
    await forceReinstallBowerDependency(req);
  } catch (e) { console.error(e); }

  clearCache(`${req.params.projectPath}-npmRegular`);
  clearCache(`${req.params.projectPath}-bowerRegular`);
  clearCache(`${req.params.projectPath}-npmDev`);
  clearCache(`${req.params.projectPath}-bowerDev`);

  res.json({});
}
