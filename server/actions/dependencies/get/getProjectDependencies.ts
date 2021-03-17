// import util from 'util';
import { executeCommandJSONWithFallback, executeCommandJSONWithFallbackYarn } from '../../executeCommand';
import {
  getInstalledVersion,
  getWantedVersion,
  getLatestVersion,
} from '../../../utils/mapDependencies';
import type * as Dependency from '../../../types/Dependency';
import type * as Commands from '../../../Commands';
import type * as CommandsYarn from '../../../CommandsYarn';
import { getDependenciesFromPackageJson, getDevDependenciesFromPackageJson } from '../../../utils/getProjectPackageJSON';
import { getFromCache, putToCache } from '../../../utils/cache';
import { extractVersionFromYarnOutdated } from '../../yarn-utils';
import type { ResponserFunction } from '../../../newServerTypes';

function getAllDependenciesSimpleJSON(projectPath: string, yarn = false): Dependency.Entire[] {
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

async function getAllNpmDependencies(projectPath: string): Promise<Dependency.Entire[]> {
  // type
  const dependencies = getDependenciesFromPackageJson(projectPath);
  const devDependencies = getDevDependenciesFromPackageJson(projectPath);

  const { dependencies: installedInfo } = await executeCommandJSONWithFallback<Commands.Installed>(projectPath, 'npm ls --depth=0 --json');
  // latest, wanted
  const outdatedInfo = await executeCommandJSONWithFallback<Commands.Outdated>(projectPath, 'npm outdated --json');

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

async function getAllYarnDependencies(projectPath: string): Promise<Dependency.Entire[]> {
  // type
  const dependencies = getDependenciesFromPackageJson(projectPath);
  const devDependencies = getDevDependenciesFromPackageJson(projectPath);

  const anyError = await executeCommandJSONWithFallbackYarn<string | undefined>(projectPath, 'yarn check --json');
  if (anyError !== undefined) {
    // there is some error in repo, we cant extract correct information
    return getAllDependenciesSimpleJSON(projectPath, true).map((dep) => ({
      ...dep,
      installed: null,
      wanted: null,
      latest: null,
    }));
  }

  const { data: { trees: installedInfo } } = await executeCommandJSONWithFallback<CommandsYarn.Installed>(projectPath, 'yarn list --depth=0 --json');

  const outdatedInfo = await executeCommandJSONWithFallbackYarn<CommandsYarn.Outdated | undefined>(projectPath, 'yarn outdated --json');
  const outdatedInfoExtracted = extractVersionFromYarnOutdated(outdatedInfo);

  const allDependencies: Dependency.Npm[] = [
    ...Object.keys(dependencies).map((name): Dependency.Npm => ({ name, type: 'prod', required: dependencies[name] })),
    ...Object.keys(devDependencies).map((name): Dependency.Npm => ({ name, type: 'dev', required: devDependencies[name] })),
    // eslint-disable-next-line
    // ...Object.keys(extraneousInstalled).map((name): Dependency.Npm => ({ name, type: 'extraneous' })), // TODO
  ];

  return allDependencies.map((dependency): Dependency.Entire => {
    const info = installedInfo.find((x) => x.name.split('@')[0] === dependency.name);
    const installed = info?.name.split('@')[1];

    const wanted = getWantedVersion(installed, outdatedInfoExtracted[dependency.name]);
    const latest = getLatestVersion(installed, wanted, outdatedInfoExtracted[dependency.name]);

    return {
      repo: 'yarn',
      ...dependency,
      installed,
      wanted,
      latest,
    };
  });
}

export const getAllDependenciesSimple: ResponserFunction = ({
  extraParams: { projectPathDecoded, yarnLock },
}) => {
  const dependencies = getAllDependenciesSimpleJSON(projectPathDecoded, yarnLock);

  return dependencies;
};

export const getAllDependencies: ResponserFunction = async ({
  extraParams: { projectPathDecoded, yarnLock, xCacheId },
}) => {
  const cache = getFromCache(xCacheId + projectPathDecoded);
  if (cache) { return cache; }

  let dependencies = [];

  if (yarnLock) {
    dependencies = await getAllYarnDependencies(projectPathDecoded);
  } else {
    dependencies = await getAllNpmDependencies(projectPathDecoded);
  }

  putToCache(xCacheId + projectPathDecoded, dependencies);

  return dependencies;
};
