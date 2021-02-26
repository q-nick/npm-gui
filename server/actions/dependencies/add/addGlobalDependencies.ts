import type { Request, Response } from 'express';

import { executeCommand, executeCommandJSON } from '../../executeCommand';
import { getInstalledVersion, getLatestVersion } from '../../mapDependencies';
import { withCacheUpdate } from '../../../cache';
import type * as Dependency from '../../../Dependency';
import type * as Commands from '../../../Commands';

type RequestBody ={name: string; version: string}[];

async function addGlobalNpmDependency(
  req: Request<unknown, unknown, RequestBody>
): Promise<Dependency.Entire | null> {
  if (req.body[0] === undefined) {
    return null;
  }

  const { name, version } = req.body[0];

  // add
  await executeCommand(undefined, `npm install ${name}@${version || ''} -g`, true);

  // get package info
  const { dependencies: installedInfo } = await executeCommandJSON<Commands.Installed>(undefined, `npm ls ${name} --depth=0 -g --json`);

  const outdatedInfo = await executeCommandJSON<Commands.Outdated>(undefined, `npm outdated ${name} -g --json`);

  return {
    repo: 'npm',
    name,
    type: 'global',
    installed: getInstalledVersion(installedInfo[name]),
    latest: getLatestVersion(getInstalledVersion(installedInfo[name]), null, outdatedInfo[name])
  };
}

export async function addGlobalDependencies(
  req: Request, res: Response,
): Promise<void> {
  // TODO yarn?
  await withCacheUpdate(addGlobalNpmDependency, 'npm-global', 'name', req);

  res.json({});
}
