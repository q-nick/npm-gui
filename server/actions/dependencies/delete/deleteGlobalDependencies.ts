import express from 'express';
import executeCommand from '../../executeCommand';
import { withCacheSplice } from '../../../cache';

async function deleteGlobalNpmDependency(req:express.Request):Promise<string> {
  const { packageName } = req.params;
  // delete
  await executeCommand(null, `npm uninstall ${packageName} -g`, true);

  return packageName;
}

async function deleteGlobalBowerDependency(_:express.Request):Promise<void> {
  console.log('no defined');
}

export async function deleteGlobalDependency(
  req:express.Request, res:express.Response,
):Promise<void> {
  if (req.params.repoName === 'npm') {
    await withCacheSplice(deleteGlobalNpmDependency, 'npm-global', 'name', req);
  } else if (req.params.repoName === 'bower') {
    await withCacheSplice(deleteGlobalBowerDependency, 'bower-global', 'name', req);
  }

  res.json({});
}
