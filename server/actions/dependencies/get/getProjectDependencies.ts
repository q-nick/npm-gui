import type { Request, Response } from 'express';
import { executeCommandJSONWithFallback } from '../../executeCommand';
import {
  getInstalledVersion,
  getWantedVersion,
  getLatestVersion,
} from '../../mapDependencies';
import { decodePath } from '../../decodePath';
import { getProjectPackageJSON } from '../../getProjectPackageJSON';
import { hasYarn } from '../../hasYarn';
import type * as Dependency from '../../../Dependency';
import type * as Commands from '../../../Commands';

function getDependenciesFromPackageJson(projectPath: string): Record<string, string> {
  const packageJson = getProjectPackageJSON(projectPath);
  return packageJson ? packageJson.dependencies : {};
}

function getDevDependenciesFromPackageJson(projectPath: string): Record<string, string> {
  const packageJson = getProjectPackageJSON(projectPath);
  return packageJson ? packageJson.devDependencies : {};
}

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
      return depInfo && 'extraenous' in depInfo;
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

function getAllDependenciesSimpleNpm(projectPath: string, yarn: boolean): Dependency.Entire[] {
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
  req: Request<{ projectPath: unknown }>, res: Response,
): void {
  // TODO tests
  const projectPathDecoded = decodePath(req.params.projectPath);

  const yarn = hasYarn(projectPathDecoded);

  const dependencies = getAllDependenciesSimpleNpm(projectPathDecoded, yarn);

  res.json(dependencies);
}

export async function getAllDependencies(
  req: Request<{ projectPath: unknown }>, res: Response,
): Promise<void> {
  const { projectPath } = req.params;

  const projectPathDecoded = decodePath(projectPath);
  // const yarn = hasYarn(projectPathDecoded);
  // const npm = hasNpm(projectPathDecoded);

  const dependencies = await getAllNpmDependencies(projectPathDecoded);

  // dependencies = await withCachePut(
  //   yarn ? (): void => {} : getAllNpmDependencies,
  //   req.headers,
  //   projectPathDecoded,
  // );

  res.json(dependencies);
}
