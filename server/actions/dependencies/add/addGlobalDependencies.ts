import type { Request, Response } from 'express';

import { executeCommand, executeCommandJSONWithFallback } from '../../executeCommand';
import { getInstalledVersion, getLatestVersion } from '../../../utils/mapDependencies';
import type * as Dependency from '../../../types/Dependency';
import type * as Commands from '../../../Commands';
import { updateInCache } from '../../../utils/cache';

type RequestBody = [{ name: string; version: string }]; // eslint-disable-line

async function addGlobalNpmDependency(
  { name, version }: { name: string; version: string },
): Promise<Dependency.Entire> {
  // add
  await executeCommand(undefined, `npm install ${name}@${version || ''} -g`, true);

  // get package info
  const { dependencies: installedInfo } = await executeCommandJSONWithFallback<Commands.Installed>(undefined, `npm ls ${name} --depth=0 -g --json`);

  const outdatedInfo = await executeCommandJSONWithFallback<Commands.Outdated>(undefined, `npm outdated ${name} -g --json`);

  const installed = getInstalledVersion(installedInfo ? installedInfo[name] : undefined);

  return {
    repo: 'npm',
    name,
    type: 'global',
    installed,
    latest: getLatestVersion(installed, null, outdatedInfo[name]),
  };
}

export async function addGlobalDependencies(
  req: Request<unknown, unknown, RequestBody>, res: Response,
): Promise<void> {
  const dependency = await addGlobalNpmDependency(req.body[0]);
  updateInCache('global', dependency);

  res.json({});
}
