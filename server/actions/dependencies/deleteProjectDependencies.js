import executeCommand from '../executeCommand';
import { spliceFromCache } from '../../cache';
import { decodePath } from '../decodePath';

async function deleteRegularNpmDependency(req) {
  const projectPath = decodePath(req.params.projectPath);
  const { packageName } = req.params;

  // delete
  await executeCommand(projectPath, `npm uninstall ${packageName} -S`, true);

  return packageName;
}

async function deleteRegularBowerDependency(req) { // eslint-disable-line

}

async function deleteDevNpmDependency(req) {
  const projectPath = decodePath(req.params.projectPath);
  const { packageName } = req.params;

  // delete
  await executeCommand(projectPath, `npm uninstall ${packageName} -D`, true);

  return packageName;
}

async function deleteDevBowerDependency(req) { // eslint-disable-line

}

export async function deleteRegularDependencies(req, res) {
  const npmCacheName = `${req.params.projectPath}-npmRegular`;
  const bowerCacheName = `${req.params.projectPath}-bowerRegular`;

  if (req.params.repoName === 'npm') {
    const name = await deleteRegularNpmDependency(req);
    spliceFromCache(npmCacheName, { name }, 'name');
  } else if (req.params.repoName === 'bower') {
    const name = await deleteRegularBowerDependency(req);
    spliceFromCache(bowerCacheName, { name }, 'name');
  }

  res.json({});
}

export async function deleteDevDependencies(req, res) {
  const npmCacheName = `${req.params.projectPath}-npmDev`;
  const bowerCacheName = `${req.params.projectPath}-bowerDev`;

  if (req.params.repoName === 'npm') {
    const name = await deleteDevNpmDependency(req);
    spliceFromCache(npmCacheName, { name }, 'name');
  } else if (req.params.repoName === 'bower') {
    const name = await deleteDevBowerDependency(req);
    spliceFromCache(bowerCacheName, { name }, 'name');
  }

  res.json({});
}
