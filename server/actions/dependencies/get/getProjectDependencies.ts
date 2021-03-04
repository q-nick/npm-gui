import type { Request, Response } from 'express';
import { executeCommandJSONWithFallback } from '../../executeCommand';
import {
  getInstalledVersion,
  getWantedVersion,
  getLatestVersion,
} from '../../../utils/mapDependencies';
import type * as Dependency from '../../../types/Dependency';
import type * as Commands from '../../../Commands';
import { getDependenciesFromPackageJson, getDevDependenciesFromPackageJson } from '../../../utils/getProjectPackageJSON';
import { getFromCache, putToCache } from '../../../utils/cache';

async function getAllNpmDependencies(projectPath: string): Promise<Dependency.Entire[]> {
  // type
  const dependencies = getDependenciesFromPackageJson(projectPath);
  const devDependencies = getDevDependenciesFromPackageJson(projectPath);

  // installed
  // let installedInfo: Commands.Installed['dependencies'] | undefined; // eslint-disable-line

  // const installedInfo = await handleListWithException(projectPath);
  const { dependencies: installedInfo } = await executeCommandJSONWithFallback<Commands.Installed>(projectPath, 'npm ls --depth=0 --json');
  // latest, wanted
  const outdatedInfo = await executeCommandJSONWithFallback<Commands.Outdated>(projectPath, 'npm outdated --json');
  // const outdatedInfo = await
  // executeCommandJSON<Commands.Outdated>(projectPath, 'npm outdated --json');

  // unused (only regular dependencies for now)
  // TODO
  // const unusedResponse = await executeCommandJSON(projectPath, 'depcheck --json');
  // const unused = unusedResponse ? unusedResponse.dependencies : [];

  // extraneous
  const extraneousInstalled = installedInfo ? Object.keys(installedInfo)
    .filter((name) => {
      const depInfo = installedInfo[name];
      return depInfo && 'extraneous' in depInfo;
    }) : [];

  const allDependencies: Dependency.Npm[] = [
    ...Object.keys(dependencies).map((name): Dependency.Npm => ({ name, type: 'prod', required: dependencies[name] })),
    ...Object.keys(devDependencies).map((name): Dependency.Npm => ({ name, type: 'dev', required: devDependencies[name] })),
    ...Object.keys(extraneousInstalled).map((name): Dependency.Npm => ({ name, type: 'extraneous' })),
  ];

  return allDependencies.map((dependency): Dependency.Entire => {
    const installed = getInstalledVersion(
      installedInfo ? installedInfo[dependency.name] : undefined,
    );
    const wanted = getWantedVersion(installed, outdatedInfo[dependency.name]);
    const latest = getLatestVersion(installed, wanted, outdatedInfo[dependency.name]);

    return {
      repo: 'npm',
      ...dependency,
      installed,
      wanted,
      latest,
    };
  });
}

function getAllDependenciesSimpleNpm(projectPath: string, yarn = false): Dependency.Entire[] {
  const dependencies = getDependenciesFromPackageJson(projectPath);
  const devDependencies = getDevDependenciesFromPackageJson(projectPath);

  const repo = yarn ? 'yarn' : 'npm';

  return [
    ...Object.keys(dependencies)
      .map((name): Dependency.Entire => ({
        repo, name, type: 'prod', required: dependencies[name],
      })),
    ...Object.keys(devDependencies)
      .map((name): Dependency.Entire => ({
        repo, name, type: 'dev', required: devDependencies[name],
      })),
  ];
}

// controllers
export function getAllDependenciesSimple(
  req: Request, res: Response,
): void {
  const dependencies = getAllDependenciesSimpleNpm(req.projectPathDecoded);

  res.json(dependencies);
}

export async function getAllDependencies(
  req: Request, res: Response,
): Promise<void> {
  const cache = getFromCache(req.projectPathDecoded);
  if (cache) { res.json(cache); return; }

  const dependencies = await getAllNpmDependencies(req.projectPathDecoded);
  putToCache(req.projectPathDecoded, dependencies);

  res.json(dependencies);
}
