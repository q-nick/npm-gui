import express from 'express';
import executeCommand, { executeCommandJSON } from '../../executeCommand';
import { withCachePut } from '../../../cache';
import {
  mapNpmDependency,
  mapYarnResultTreeToBasic,
  mapYarnResultTableToVersion,
  mapBowerDependency,
} from '../../mapDependencies';
import { decodePath } from '../../decodePath';
import { getProjectPackageJSON, getProjectBowerJSON } from '../../getProjectPackageJSON';
import { parseJSON } from '../../parseJSON';
import { hasYarn, hasNpm, hasBower } from '../../hasYarn';

function getDependenciesFromPackageJson(projectPath: string): { [key: string]: string } {
  const packageJson = getProjectPackageJSON(projectPath);
  return (packageJson && packageJson.dependencies) || [];
}

function getDevDependenciesFromPackageJson(projectPath: string): { [key: string]: string } {
  const packageJson = getProjectPackageJSON(projectPath);
  return (packageJson && packageJson.devDependencies) || [];
}

function getDependenciesFromBowerJson(projectPath: string): { [key: string]: string } {
  const bowerJson = getProjectBowerJSON(projectPath);
  return (bowerJson && bowerJson.dependencies) || [];
}

function getDevDependenciesFromBowerJson(projectPath: string): { [key: string]: string } {
  const bowerJson = getProjectBowerJSON(projectPath);
  return (bowerJson && bowerJson.devDependencies) || [];
}

async function getAllNpmDependencies(projectPath: string): Promise<Dependency.Entire[]> {
  // type
  const dependencies = getDependenciesFromPackageJson(projectPath);
  const devDependencies = getDevDependenciesFromPackageJson(projectPath);
  // required
  const dependenciesInPackageJson = { ...dependencies, ...devDependencies };

  // installed
  const { dependencies: dependenciesInstalled } = await executeCommandJSON(projectPath, 'npm ls --depth=0 --json');

  // latest, wanted
  const outdated = await executeCommandJSON(projectPath, 'npm outdated --json');

  // unused (only regular dependencies for now)
  const unusedResponse = await executeCommandJSON(projectPath, 'depcheck --json');
  const unused = unusedResponse ? unusedResponse.dependencies : [];

  // extraenous
  const extraneousInstalled = Object.keys(dependenciesInstalled)
    .filter((name) => dependenciesInstalled[name].extraneous);

  const dependenciesWithType: Dependency.Npm[] = [
    ...Object.keys(dependencies).map((name): Dependency.Npm => ({ name, type: 'prod' })),
    ...Object.keys(devDependencies).map((name): Dependency.Npm => ({ name, type: 'dev' })),
    ...Object.keys(extraneousInstalled).map((name): Dependency.Npm => ({ name, type: 'extraneous' })),
  ];

  return dependenciesWithType
    .map((dependency) => mapNpmDependency(
      dependency.name,
      dependenciesInstalled[dependency.name],
      outdated && outdated[dependency.name],
      dependenciesInPackageJson[dependency.name],
      dependency.type,
      unused.includes(dependency.name),
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
  const commandLsJSONResults: Yarn.Result[] = commandLsJSON.stdout.split('\n').filter((s) => s).map(parseJSON);
  const dependenciesInstalled = mapYarnResultTreeToBasic(commandLsJSONResults);
  // latest, wanted
  const outdatedResult = await executeCommand(projectPath, 'yarn outdated --depth=0 --json');
  if (outdatedResult.stderr) {
    throw JSON.parse(outdatedResult.stderr).data;
  }
  const outdatedResults: Yarn.Result[] = outdatedResult.stdout.split('\n').filter((s) => s).map(parseJSON);
  const outdated = mapYarnResultTableToVersion(outdatedResults);

  // unused (only regular dependencies for now)
  const unusedResponse = await executeCommandJSON(projectPath, 'depcheck --json');
  const unused = unusedResponse ? unusedResponse.dependencies : [];

  // extraenous
  // const extraneousInstalled = Object.keys(dependenciesInstalled)
  //   .filter(name => dependenciesInstalled[name].extraneous);

  // console.log('here', outdated);

  const dependenciesWithType: Dependency.Npm[] = [
    ...Object.keys(dependencies).map((name): Dependency.Npm => ({ name, type: 'prod' })),
    ...Object.keys(devDependencies).map((name): Dependency.Npm => ({ name, type: 'dev' })),
    // ...Object.keys(extraneousInstalled).map(name => ({ name, type: 'extraneous' })),
  ];

  return dependenciesWithType
    .map((dependency) => mapNpmDependency(
      dependency.name,
      dependenciesInstalled[dependency.name],
      outdated && outdated[dependency.name],
      dependenciesInPackageJson[dependency.name],
      dependency.type,
      unused.includes(dependency.name),
      'yarn',
    ));
}

async function getAllBowerDependencies(projectPath: string): Promise<Dependency.Entire[]> {
  // type
  const dependencies = getDependenciesFromBowerJson(projectPath);

  const commandLsJSON = await executeCommandJSON(projectPath, 'bower ls --json');

  return Object.keys(commandLsJSON.dependencies)
    .map((name: string) => mapBowerDependency(name, commandLsJSON.dependencies[name], dependencies[name] ? 'prod' : 'dev'));
}

function getAllDependenciesSimpleNpm(projectPath: string, yarn: boolean): Dependency.Entire[] {
  const dependencies = getDependenciesFromPackageJson(projectPath);
  const devDependencies = getDevDependenciesFromPackageJson(projectPath);

  const npmDependenciesWithType: Dependency.Npm[] = [
    ...Object.keys(dependencies).map((name): Dependency.Npm => ({ name, type: 'prod', required: dependencies[name] })),
    ...Object.keys(devDependencies).map((name): Dependency.Npm => ({ name, type: 'dev', required: devDependencies[name] })),
  ];

  const repo: Dependency.Repo = yarn ? 'yarn' : 'npm';

  return npmDependenciesWithType.map((dependency) => ({
    ...dependency,
    repo,
    installed: undefined,
    wanted: undefined,
    latest: undefined,
    unused: false,
  }));
}

function getAllDependenciesSimpleBower(projectPath: string): Dependency.Entire[] {
  const dependencies = getDependenciesFromBowerJson(projectPath);
  const devDependencies = getDevDependenciesFromBowerJson(projectPath);

  // we will use npm type
  const bowerDependenciesWithType: Dependency.Npm[] = [
    ...Object.keys(dependencies).map((name): Dependency.Npm => ({ name, type: 'prod', required: dependencies[name] })),
    ...Object.keys(devDependencies).map((name): Dependency.Npm => ({ name, type: 'dev', required: devDependencies[name] })),
  ];

  const repo: Dependency.Repo = 'bower';

  return bowerDependenciesWithType.map((dependency) => ({
    ...dependency,
    repo,
    installed: undefined,
    wanted: undefined,
    latest: undefined,
    unused: false,
  }));
}

// controllers
export async function getAllDependenciesSimple(
  req: express.Request, res: express.Response,
): Promise<void> {
  // TODO tests
  const projectPathDecoded = decodePath(req.params.projectPath) as string;

  let npmDependencies: Dependency.Entire[] = [];
  let bowerDependencies: Dependency.Entire[] = [];

  const yarn = hasYarn(projectPathDecoded);

  npmDependencies = getAllDependenciesSimpleNpm(projectPathDecoded, yarn);
  bowerDependencies = getAllDependenciesSimpleBower(projectPathDecoded);

  res.json([...npmDependencies, ...bowerDependencies]);
}

export async function getAllDependencies(
  req: express.Request, res: express.Response,
): Promise<void> {
  const { projectPath }: any = req.params;
  const projectPathDecoded = decodePath(projectPath) as string;
  const yarn = hasYarn(projectPathDecoded);
  const npm = hasNpm(projectPathDecoded);
  const bower = hasBower(projectPathDecoded);

  let npmDependencies: Dependency.Entire[] = [];
  let bowerDependencies: Dependency.Entire[] = [];

  if (yarn) {
    try {
      npmDependencies = await withCachePut(
        getAllYarnDependencies,
        `${req.headers['x-cache-id']}-${projectPath}-npm`,
        projectPathDecoded,
      );
    } catch (e) {
      // yarn ?exception?
      console.log(e);
      npmDependencies = getAllDependenciesSimpleNpm(projectPathDecoded, yarn);
    }
  } else if (npm) {
    npmDependencies = await withCachePut(
      getAllNpmDependencies,
      `${req.headers['x-cache-id']}-${projectPath}-npm`,
      projectPathDecoded,
    );
  }

  if (bower) {
    bowerDependencies = await withCachePut(
      getAllBowerDependencies,
      `${req.headers['x-cache-id']}-${projectPath}-bower`,
      projectPathDecoded,
    );
  }

  res.json([...npmDependencies, ...bowerDependencies]);
}
