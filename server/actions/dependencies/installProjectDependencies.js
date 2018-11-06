import rimraf from 'rimraf';
import path from 'path';

import executeCommand from '../executeCommand';
import { clearCache } from '../../cache';
import { decodePath } from '../decodePath';

async function installAsIsRegularNpmDependency(req) {
  const projectPath = decodePath(req.params.projectPath);

  // add
  await executeCommand(projectPath, 'npm install --only=prod', true);
}

async function installAsIsDevNpmDependency(req) {
  const projectPath = decodePath(req.params.projectPath);

  // add
  await executeCommand(projectPath, 'npm install --only=dev', true);
}

async function forceReinstallNpmDependency(req) {
  const projectPath = decodePath(req.params.projectPath);
  console.log(`${path.normalize(projectPath)}/node_modules`, `${path.normalize(projectPath)}/package-lock.json`);
  rimraf.sync(`${path.normalize(projectPath)}/node_modules`);
  rimraf.sync(`${path.normalize(projectPath)}/package-lock.json`);
  // add
  await executeCommand(projectPath, 'npm install --force', true);
}

async function installAsIsRegularBowerDependency(req) { // eslint-disable-line
}

async function installAsIsDevBowerDependency(req) { // eslint-disable-line
}

async function forceReinstallBowerDependency(req) { // eslint-disable-line
}

export async function installAsIsRegularDependencies(req, res) {
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

export async function installAsIsDevDependencies(req, res) {
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

export async function forceReinstallDependencies(req, res) {
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
