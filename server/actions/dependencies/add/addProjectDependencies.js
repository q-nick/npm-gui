import fs from 'fs';

import executeCommand from '../../executeCommand';
import UtilsService from '../../../service/utils/utils.service';
import { updateInCache, putToCache } from '../../../cache';
import { mapNpmDependency } from '../../mapDependencies';
import { decodePath } from '../../decodePath';

async function getNpmPackageWithInfo(projectPath, packageName, packageJsonKey) {
  const commandLsResult = await executeCommand(projectPath, `npm ls ${packageName} --depth=0 --json`);
  const { dependencies } = UtilsService.parseJSON(commandLsResult.stdout);

  const commandOutdatedResult = await executeCommand(projectPath, `npm outdated ${packageName} --json`);
  const versions = UtilsService.parseJSON(commandOutdatedResult.stdout) || { versions: [] };

  const packageJson = UtilsService.parseJSON(fs.readFileSync(`${projectPath}/package.json`, 'utf-8'));

  return mapNpmDependency(
    packageName,
    dependencies[packageName],
    versions && versions[packageName],
    packageJson[packageJsonKey][packageName],
  );
}

async function addRegularNpmDependency(req) {
  const projectPath = decodePath(req.params.projectPath);
  const { packageName, version } = req.body[0];

  // add
  await executeCommand(projectPath, `npm install ${packageName}@${version || ''} -S`, true);

  return getNpmPackageWithInfo(projectPath, packageName, 'dependencies');
}

async function addRegularBowerDependency(req) { // eslint-disable-line

}

async function addRegularNpmDependencies(req) {
  const projectPath = decodePath(req.params.projectPath);
  const dependenciesToInstall = req.body;

  // add
  await executeCommand(projectPath, `npm install ${dependenciesToInstall.map(d => `${d.packageName}@${d.version || ''}`).join(' ')} -S`, true);
}

async function addRegularBowerDependencies(req) { // eslint-disable-line
}

async function addDevNpmDependency(req) {
  const projectPath = decodePath(req.params.projectPath);
  const { packageName, version } = req.body[0];

  // add
  await executeCommand(projectPath, `npm install ${packageName}@${version || ''} -D`, true);

  return getNpmPackageWithInfo(projectPath, packageName, 'devDependencies');
}

async function addDevBowerDependency(req) { // eslint-disable-line

}

async function addDevNpmDependencies(req) {
  const projectPath = decodePath(req.params.projectPath);
  const dependenciesToInstall = req.body;

  // add
  await executeCommand(projectPath, `npm install ${dependenciesToInstall.map(d => `${d.packageName}@${d.version || ''}`).join(' ')} -D`, true);
}

async function addDevBowerDependencies(req) { // eslint-disable-line
}

export async function addRegularDependencies(req, res) {
  const npmCacheName = `${req.params.projectPath}-npmRegular`;
  const bowerCacheName = `${req.params.projectPath}-bowerRegular`;

  if (req.params.repoName === 'npm' && req.body.length === 1) {
    const dependencyInfo = await addRegularNpmDependency(req);
    updateInCache(npmCacheName, dependencyInfo, 'name');
  } else if (req.params.repoName === 'npm' && req.body.length > 1) {
    await addRegularNpmDependencies(req);
    putToCache(npmCacheName, null);
  } else if (req.params.repoName === 'bower' && req.body.length === 1) {
    const dependencyInfo = await addRegularBowerDependency(req);
    updateInCache(bowerCacheName, dependencyInfo, 'name');
  } else if (req.params.repoName === 'bower' && req.body.length > 1) {
    await addRegularBowerDependencies(req);
    putToCache(npmCacheName, null);
  }

  res.json({});
}

export async function addDevDependencies(req, res) {
  const npmCacheName = `${req.params.projectPath}-npmDev`;
  const bowerCacheName = `${req.params.projectPath}-bowerDev`;

  if (req.params.repoName === 'npm' && req.body.length === 1) {
    const dependencyInfo = await addDevNpmDependency(req);
    updateInCache(npmCacheName, dependencyInfo, 'name');
  } else if (req.params.repoName === 'npm' && req.body.length > 1) {
    await addDevNpmDependencies(req);
    putToCache(npmCacheName, null);
  } else if (req.params.repoName === 'bower' && req.body.length === 1) {
    const dependencyInfo = await addDevBowerDependency(req);
    updateInCache(bowerCacheName, dependencyInfo, 'name');
  } else if (req.params.repoName === 'bower' && req.body.length > 1) {
    await addDevBowerDependencies(req);
    putToCache(npmCacheName, null);
  }

  res.json({});
}
