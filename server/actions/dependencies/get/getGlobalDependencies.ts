import * as express from 'express';

import executeCommand from '../../executeCommand';
import { mapNpmDependency } from '../../mapDependencies';
import { withCachePut } from '../../../cache';
import { parseJSON } from '../../parseJSON';

async function getGlobalNpmDependencies():Promise<Dependency.Npm[]> {
  const commandResult = await executeCommand(null, 'npm ls -g --depth=0 --json');
  const { dependencies } = parseJSON(commandResult.stdout);

  const commandOutdatedResult = await executeCommand(null, 'npm outdated -g --json');
  const versions = parseJSON(commandOutdatedResult.stdout);

  return Object.keys(dependencies)
    .map((name):Dependency.Npm => mapNpmDependency(
      name,
      dependencies[name],
      versions && versions[name],
      dependencies[name].version,
      'global',
    ));
}

async function getGlobalNpmDependenciesSimple():Promise<Dependency.Npm[]> {
  const commandResult = await executeCommand(null, 'npm ls -g --depth=0 --json');
  const { dependencies } = parseJSON(commandResult.stdout);

  return Object.keys(dependencies)
    .map((name):Dependency.Npm => mapNpmDependency(
      name,
      dependencies[name],
      undefined,
      dependencies[name].version,
      'global',
    ));
}

export async function getGlobalDependencies(_:express.Request, res:express.Response):Promise<void> {
  let npmDependencies:Dependency.Npm[] = [];

  try {
    npmDependencies = await withCachePut(getGlobalNpmDependencies, 'npm-global');
  } catch (e) { console.error(e); }

  res.json(npmDependencies);
}

export async function getGlobalDependenciesSimple(
  _:express.Request, res:express.Response):Promise<void> {
  let npmDependencies:Dependency.Npm[] = [];

  try {
    npmDependencies = await withCachePut(getGlobalNpmDependenciesSimple, 'npm-global-simple');
  } catch (e) { console.error(e); }

  res.json(npmDependencies);
}
