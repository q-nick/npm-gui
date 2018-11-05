import executeCommand from '../executeCommand';
import { putToCache } from '../../cache';
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

async function installAsIsRegularBowerDependency(req) { // eslint-disable-line
}

async function installAsIsDevBowerDependency(req) { // eslint-disable-line
}

export async function installAsIsRegularDependencies(req, res) {
  const npmCacheNameRegular = `${req.params.projectPath}-npmRegular`;
  const bowerCacheNameRegular = `${req.params.projectPath}-bowerRegular`;

  if (req.params.repoName === 'npm') {
    await installAsIsRegularNpmDependency(req);
    putToCache(npmCacheNameRegular, null);
    putToCache(bowerCacheNameRegular, null);
  } else if (req.params.repoName === 'bower') {
    await installAsIsRegularBowerDependency(req);
    putToCache(npmCacheNameRegular, null);
    putToCache(bowerCacheNameRegular, null);
  }

  res.json({});
}

export async function installAsIsDevDependencies(req, res) {
  const npmCacheNameDev = `${req.params.projectPath}-npmDev`;
  const bowerCacheNameDev = `${req.params.projectPath}-bowerDev`;

  if (req.params.repoName === 'npm') {
    await installAsIsDevNpmDependency(req);
    putToCache(npmCacheNameDev, null);
    putToCache(bowerCacheNameDev, null);
  } else if (req.params.repoName === 'bower') {
    await installAsIsDevBowerDependency(req);
    putToCache(npmCacheNameDev, null);
    putToCache(bowerCacheNameDev, null);
  }

  res.json({});
}
