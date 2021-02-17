import express from 'express';
import executeCommand from '../../executeCommand';
import { withCacheSplice } from '../../../cache';

async function deleteGlobalNpmDependency(req:express.Request):Promise<string> {
  const { packageName } = req.params;
  // delete
  await executeCommand(null, `npm uninstall ${packageName} -g`, true);

  return packageName;
}

export async function deleteGlobalDependency(
  req:express.Request, res:express.Response,
):Promise<void> {
  await withCacheSplice(deleteGlobalNpmDependency, 'npm-global', 'name', req);

  res.json({});
}
