import fs from 'fs';

import executeCommand from '../executeCommand';
import UtilsService from '../../service/utils/utils.service';
import { updateInCache } from '../../cache';
import { mapNpmDependency } from '../mapDependencies';
import { decodePath } from '../decodePath';


async function addRegularNpmDependency(req) {
  const projectPath = decodePath(req.params.projectPath);
  const { packageName, version } = req.body;

  // add
  await executeCommand(projectPath, `npm install ${packageName}@${version || ''} -S`, true);

  // get package info
  const commandLsResult = await executeCommand(projectPath, `npm ls ${packageName} --depth=0 --json`);
  const { dependencies } = UtilsService.parseJSON(commandLsResult.stdout);

  const commandOutdtedResult = await executeCommand(projectPath, `npm outdated ${packageName} --json`);
  const versions = UtilsService.parseJSON(commandOutdtedResult.stdout) || { versions: [] };

  const packageJson = UtilsService.parseJSON(fs.readFileSync(`${projectPath}/package.json`, 'utf-8'));

  return mapNpmDependency(
    packageName,
    dependencies[packageName],
    versions && versions[packageName],
    packageJson.dependencies[packageName],
  );
}

async function addRegularBowerDependency(req) { // eslint-disable-line

}

async function addDevNpmDependency(req) {
  const projectPath = decodePath(req.params.projectPath);
  const { packageName, version } = req.body;

  // add
  await executeCommand(projectPath, `npm install ${packageName}@${version || ''} -D`, true);

  // get package info
  const commandLsResult = await executeCommand(projectPath, `npm ls ${packageName} --depth=0 --json`);
  const { dependencies } = UtilsService.parseJSON(commandLsResult.stdout);

  const commandOutdatedResult = await executeCommand(projectPath, `npm outdated ${packageName} --json`);
  const versions = UtilsService.parseJSON(commandOutdatedResult.stdout) || { versions: [] };

  const packageJson = UtilsService.parseJSON(fs.readFileSync(`${projectPath}/package.json`, 'utf-8'));

  return mapNpmDependency(
    packageName,
    dependencies[packageName],
    versions && versions[packageName],
    packageJson.devDependencies[packageName],
  );
}

async function addDevBowerDependency(req) { // eslint-disable-line

}

export async function addRegularDependencies(req, res) {
  const npmCacheName = `${req.params.projectPath}-npmRegular`;
  const bowerCacheName = `${req.params.projectPath}-bowerRegular`;

  if (req.params.repoName === 'npm') {
    const dependencyInfo = await addRegularNpmDependency(req);
    updateInCache(npmCacheName, dependencyInfo, 'name');
  } else if (req.params.repoName === 'bower') {
    const dependencyInfo = await addRegularBowerDependency(req);
    updateInCache(bowerCacheName, dependencyInfo, 'name');
  }

  res.json({});
}

export async function addDevDependencies(req, res) {
  const npmCacheName = `${req.params.projectPath}-npmDev`;
  const bowerCacheName = `${req.params.projectPath}-bowerDev`;

  if (req.params.repoName === 'npm') {
    const dependencyInfo = await addDevNpmDependency(req);
    updateInCache(npmCacheName, dependencyInfo, 'name');
  } else if (req.params.repoName === 'bower') {
    const dependencyInfo = await addDevBowerDependency(req);
    updateInCache(bowerCacheName, dependencyInfo, 'name');
  }

  res.json({});
}
