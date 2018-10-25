import executeCommand from '../executeCommand';
import UtilsService from '../../service/utils/utils.service';
import { mapNpmDependency } from '../mapDependencies';
import { updateInCache } from '../../cache';

async function addGlobalNpmDependency(req) {
  const { packageName, version } = req.body;

  // add
  await executeCommand(null, `npm install ${packageName}@${version || ''} -g`, true);

  // get package info
  const commandLsResult = await executeCommand(null, `npm ls ${packageName} --depth=0 -g --json`);
  const { dependencies } = UtilsService.parseJSON(commandLsResult.stdout);

  const commandOutdtedResult = await executeCommand(null, `npm outdated ${packageName} -g --json`);
  const versions = UtilsService.parseJSON(commandOutdtedResult.stdout) || { versions: [] };

  return mapNpmDependency(
    packageName,
    dependencies[packageName],
    versions[packageName],
    dependencies[packageName].version,
  );
}


async function addGlobalBowerDependency(req) { // eslint-disable-line

}

export async function addGlobalDependencies(req, res) {
  const npmCacheName = 'global-npmGlobal';
  const bowerCacheName = 'global-bowerGlobal';

  if (req.params.repoName === 'npm') {
    const dependencyInfo = await addGlobalNpmDependency(req);
    updateInCache(npmCacheName, dependencyInfo, 'name');
  } else if (req.params.repoName === 'bower') {
    const dependencyInfo = await addGlobalBowerDependency(req);
    updateInCache(bowerCacheName, dependencyInfo, 'name');
  }

  res.json({});
}
