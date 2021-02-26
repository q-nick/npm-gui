import type express from 'express';
import {executeCommand} from '../../executeCommand';
import { withCacheSplice } from '../../../cache';

async function deleteGlobalNpmDependency(
  req: express.Request<{packageName: string}>
): Promise<string> {
  const { packageName } = req.params;
  // delete
  await executeCommand(undefined, `npm uninstall ${packageName} -g`, true);

  return packageName;
}

export async function deleteGlobalDependency(
  req: express.Request<{packageName: string}>, res: express.Response,
): Promise<void> {
  await withCacheSplice(deleteGlobalNpmDependency, 'npm-global', 'name', req);

  res.json({});
}
