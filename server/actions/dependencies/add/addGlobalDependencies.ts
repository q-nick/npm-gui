import * as express from 'express';

import executeCommand from '../../executeCommand';
import { mapNpmDependency2 as mapNpmDependency } from '../../mapDependencies';
import { withCacheUpdate } from '../../../cache';
import { parseJSON } from '../../parseJSON';

async function addGlobalNpmDependency(req:express.Request):Promise<Dependency.Entire> {
  const { name, version } = req.body[0];

  // add
  await executeCommand(null, `npm install ${name}@${version || ''} -g`, true);

  // get package info
  const commandLsResult = await executeCommand(null, `npm ls ${name} --depth=0 -g --json`);
  const { dependencies } = parseJSON(commandLsResult.stdout);

  const commandOutdtedResult = await executeCommand(null, `npm outdated ${name} -g --json`);
  const versions = parseJSON(commandOutdtedResult.stdout) || { versions: [] };

  return (mapNpmDependency as any)(
    name,
    dependencies[name],
    versions[name],
    dependencies[name].version,
    'global',
    false,
  );
}

export async function addGlobalDependencies(
  req:express.Request, res:express.Response,
):Promise<void> {
  // TODO yarn?
  await withCacheUpdate(addGlobalNpmDependency, 'npm-global', 'name', req);

  res.json({});
}
