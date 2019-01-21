import executeCommand, { executeCommandJSON } from '../../executeCommand';
import { withCachePut } from '../../../cache';
import {
  mapNpmDependency,
  mapYarnResultTreeToBasic,
  mapYarnResultTableToVersion } from '../../mapDependencies';
import { decodePath } from '../../decodePath';
import { getProjectPackageJSON } from '../../getProjectPackageJSON';
import { hasYarn } from '../../hasYarn';
import * as express from 'express';
import { parseJSON } from '../../parseJSON';

function getDependenciesFromPackageJson(projectPath: string): { [key: string]: string } {
  const packageJson = getProjectPackageJSON(projectPath);
  return (packageJson && packageJson.dependencies) || [];
}

function getDevDependenciesFromPackageJson(projectPath: string): { [key: string]: string } {
  const packageJson = getProjectPackageJSON(projectPath);
  return (packageJson && packageJson.devDependencies) || [];
}

async function getAllNpmDependencies(projectPath: string): Promise<Dependency.Entire[]> {
  // type
  const dependencies = getDependenciesFromPackageJson(projectPath);
  const devDependencies = getDevDependenciesFromPackageJson(projectPath);
  // required
  const dependenciesInPackageJson = { ...dependencies, ...devDependencies };

  // installed
  const commandLsJSON = await executeCommandJSON(projectPath, 'npm ls --depth=0 --json');
  const dependenciesInstalled = commandLsJSON.dependencies;

  // latest, wanted
  const outdated = await executeCommandJSON(projectPath, 'npm outdated --json');

  // extraenous
  const extraneousInstalled = Object.keys(dependenciesInstalled)
    .filter(name => dependenciesInstalled[name].extraneous);

  const dependenciesWithType: Dependency.Npm[] = [
    ...Object.keys(dependencies).map((name): Dependency.Npm => ({ name, type: 'regular' })),
    ...Object.keys(devDependencies).map((name): Dependency.Npm => ({ name, type: 'dev' })),
    ...Object.keys(extraneousInstalled).map((name): Dependency.Npm => ({ name, type: 'extraneous' })), // tslint:disable:max-line-length
  ];

  return dependenciesWithType
    .map(dependency => mapNpmDependency(
      dependency.name,
      dependenciesInstalled[dependency.name],
      outdated && outdated[dependency.name],
      dependenciesInPackageJson[dependency.name],
      dependency.type,
    ));
}

async function getAllYarnDependencies(projectPath: string): Promise<Dependency.Entire[]> {
  // type
  const dependencies = getDependenciesFromPackageJson(projectPath);
  const devDependencies = getDevDependenciesFromPackageJson(projectPath);
  // required
  const dependenciesInPackageJson = { ...dependencies, ...devDependencies };

  // installed
  const commandLsJSON = await executeCommand(projectPath, 'yarn list --depth=0 --json');
  const commandLsJSONResults:Yarn.Result[] = commandLsJSON.stdout.split('\n').filter(s => s).map(parseJSON);
  const dependenciesInstalled = mapYarnResultTreeToBasic(commandLsJSONResults);

  // latest, wanted
  const outdatedResult = await executeCommand(projectPath, 'yarn outdated --depth=0 --json');
  const outdatedResults:Yarn.Result[] = outdatedResult.stdout.split('\n').filter(s => s).map(parseJSON);
  const outdated = mapYarnResultTableToVersion(outdatedResults);

  // extraenous
  // const extraneousInstalled = Object.keys(dependenciesInstalled)
  //   .filter(name => dependenciesInstalled[name].extraneous);

  // console.log('here', outdated);

  const dependenciesWithType: Dependency.Npm[] = [
    ...Object.keys(dependencies).map((name): Dependency.Npm => ({ name, type: 'regular' })),
    ...Object.keys(devDependencies).map((name): Dependency.Npm => ({ name, type: 'dev' })),
    // ...Object.keys(extraneousInstalled).map(name => ({ name, type: 'extraneous' })),
  ];

  return dependenciesWithType
    .map(dependency => mapNpmDependency(
      dependency.name,
      dependenciesInstalled[dependency.name],
      outdated && outdated[dependency.name],
      dependenciesInPackageJson[dependency.name],
      dependency.type,
      'yarn',
    ));
}

async function getAllBowerDependencies(): Promise<any[]> { // eslint-disable-line
  return [];
}

// controllers
export async function getAllDependenciesSimple(req: express.Request, res: express.Response): Promise<void> {
  const projectPath = decodePath(req.params.projectPath);

  let npmDependencies: Dependency.Npm[] = [];
  let bowerDependencies: Dependency.Bower[] = [];

  try {
    const dependencies = getDependenciesFromPackageJson(projectPath);
    const devDependencies = getDevDependenciesFromPackageJson(projectPath);

    const npmDependenciesWithType: Dependency.Npm[] = [
      ...Object.keys(dependencies).map((name): Dependency.Npm => ({ name, type: 'regular', required: dependencies[name] })),
      ...Object.keys(devDependencies).map((name): Dependency.Npm => ({ name, type: 'dev', required: devDependencies[name] })),
    ];

    npmDependencies = npmDependenciesWithType.map(dependency => ({
      ...dependency,
      repo: null,
      installed: undefined,
      wanted: undefined,
      latest: undefined,
    }));
  } catch (e) { console.error(e); }

  try {
    bowerDependencies = [];
  } catch (e) { console.error(e); }

  res.json([...npmDependencies, ...bowerDependencies]);
}

export async function getAllDependencies(req: express.Request, res: express.Response): Promise<void> {
  const { projectPath } : { projectPath: string } = req.params;
  const projectPathDecoded = decodePath(projectPath);
  const yarn = hasYarn(projectPathDecoded);

  let npmDependencies:Dependency.Entire[] = [];
  let bowerDependencies:Dependency.Entire[] = [];

  try {
    npmDependencies = await withCachePut(
      yarn ? getAllYarnDependencies : getAllNpmDependencies, `${projectPath}-npm`,
      projectPathDecoded);
  } catch (e) {
    console.error('yarn', e);
  }

  try {
    bowerDependencies = await withCachePut(getAllBowerDependencies, 'bower');
  } catch (e) { console.error('bower', e); }

  res.json([...npmDependencies, ...bowerDependencies]);
}
