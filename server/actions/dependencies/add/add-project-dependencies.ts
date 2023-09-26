/* eslint-disable max-lines */
import z from 'zod';

import { projectProcedure } from '../../../trpc/trpc-router';
import type { Installed, Outdated } from '../../../types/commands.types';
import type {
  Basic,
  DependencyInstalled,
  Type,
} from '../../../types/dependency.types';
import type { InstalledPNPM } from '../../../types/pnpm.types';
import type { InstalledYarn, OutdatedYarn } from '../../../types/yarn.types';
import { clearCache, updateInCache } from '../../../utils/cache';
import {
  getRequiredFromPackageJson,
  getTypeFromPackageJson,
} from '../../../utils/get-project-package-json';
import {
  getInstalledVersion,
  getLatestVersion,
  getWantedVersion,
} from '../../../utils/map-dependencies';
import {
  executeCommandJSONWithFallback,
  executeCommandJSONWithFallbackYarn,
  executeCommandSimple,
} from '../../execute-command';
import { executePnpmOutdated } from '../../pnpm-utils';
import { extractVersionFromYarnOutdated } from '../../yarn-utils';
import {
  extractNameFromDependencyString,
  extractVersionFromDependencyString,
} from '../extras/dependency-details';

const getNpmPackageWithInfo = async (
  projectPath: string,
  dependencyName: string,
): Promise<DependencyInstalled> => {
  // installed or not
  const { dependencies: installedInfo } =
    await executeCommandJSONWithFallback<Installed>(
      projectPath,
      `npm ls ${dependencyName} --depth=0 --json`,
    );

  // latest, wanted
  const outdatedInfo = await executeCommandJSONWithFallback<Outdated>(
    projectPath,
    `npm outdated ${dependencyName} --json`,
  );

  // required & type
  const type = getTypeFromPackageJson(projectPath, dependencyName);
  const required = getRequiredFromPackageJson(projectPath, dependencyName);

  const installed = getInstalledVersion(
    installedInfo ? installedInfo[dependencyName] : undefined,
  );
  const wanted = getWantedVersion(installed, outdatedInfo[dependencyName]);
  const latest = getLatestVersion(
    installed,
    wanted,
    outdatedInfo[dependencyName],
  );

  return {
    manager: 'npm',
    required,
    name: dependencyName,
    type,
    installed,
    wanted,
    latest,
  };
};

const getPnpmPackageWithInfo = async (
  projectPath: string,
  dependencyName: string,
): Promise<DependencyInstalled> => {
  // installed or not
  const [
    {
      devDependencies: installedInfoDevelopment,
      dependencies: installedInfoRegular,
    },
  ] = await executeCommandJSONWithFallback<InstalledPNPM>(
    projectPath,
    `pnpm ls ${dependencyName} --depth=0 --json`,
  );
  const installedInfo = {
    ...installedInfoDevelopment,
    ...installedInfoRegular,
  };

  // latest, wanted
  const outdatedInfo: Outdated = {};
  await executePnpmOutdated(outdatedInfo, projectPath);
  await executePnpmOutdated(outdatedInfo, projectPath, true);

  // required & type
  const type = getTypeFromPackageJson(projectPath, dependencyName);
  const required = getRequiredFromPackageJson(projectPath, dependencyName);

  const installed = getInstalledVersion(installedInfo[dependencyName]);
  const wanted = getWantedVersion(installed, outdatedInfo[dependencyName]);
  const latest = getLatestVersion(
    installed,
    wanted,
    outdatedInfo[dependencyName],
  );

  return {
    manager: 'pnpm',
    required,
    name: dependencyName,
    type,
    installed,
    wanted,
    latest,
  };
};

const getYarnPackageWithInfo = async (
  projectPath: string,
  dependencyName: string,
): Promise<DependencyInstalled> => {
  // installed or not
  const {
    data: { trees: installedInfo },
  } = await executeCommandJSONWithFallback<InstalledYarn>(
    projectPath,
    `yarn list --pattern ${dependencyName} --depth=0 --json`,
  );

  // latest, wanted
  const outdatedInfo = await executeCommandJSONWithFallbackYarn<
    OutdatedYarn | undefined
  >(projectPath, `yarn outdated ${dependencyName} --json`);
  const outdatedInfoExtracted = extractVersionFromYarnOutdated(outdatedInfo);

  // required & type
  const type = getTypeFromPackageJson(projectPath, dependencyName);
  const required = getRequiredFromPackageJson(projectPath, dependencyName);

  const info = installedInfo.find(
    (x) => extractNameFromDependencyString(x.name) === dependencyName,
  );
  const installed = info ? extractVersionFromDependencyString(info.name) : null;

  const wanted = getWantedVersion(
    installed,
    outdatedInfoExtracted[dependencyName],
  );
  const latest = getLatestVersion(
    installed,
    wanted,
    outdatedInfoExtracted[dependencyName],
  );

  return {
    manager: 'yarn',
    required,
    name: dependencyName,
    type,
    installed,
    wanted,
    latest,
  };
};

const addNpmDependencies = async (
  projectPath: string,
  dependencies: Basic[],
  type: Type,
): Promise<DependencyInstalled | undefined> => {
  // add list
  const dependenciesToInstall = dependencies.map(
    (d) => `${d.name}${d.version ? `@${d.version}` : ''}`,
  );
  const command = `npm install ${dependenciesToInstall.join(' ')} -${
    type === 'prod' ? 'P' : 'D'
  } --json`;
  await executeCommandSimple(projectPath, command);

  if (dependencies.length === 1 && dependencies[0]) {
    return getNpmPackageWithInfo(projectPath, dependencies[0].name);
  }

  return undefined;
};

const addPnpmDependencies = async (
  projectPath: string,
  dependencies: Basic[],
  type: Type,
): Promise<DependencyInstalled | undefined> => {
  // add list
  const dependenciesToInstall = dependencies.map(
    (d) => `${d.name}${d.version ? `@${d.version}` : ''}`,
  );
  const command = `pnpm install ${dependenciesToInstall.join(' ')} -${
    type === 'prod' ? 'P' : 'D'
  }`;
  await executeCommandSimple(projectPath, command);

  if (dependencies.length === 1 && dependencies[0]) {
    return getPnpmPackageWithInfo(projectPath, dependencies[0].name);
  }

  return undefined;
};

const addYarnDependencies = async (
  projectPath: string,
  dependencies: Basic[],
  type: Type,
): Promise<DependencyInstalled | undefined> => {
  // add list
  const dependenciesToInstall = dependencies.map(
    (d) => `${d.name}${d.version ? `@${d.version}` : ''}`,
  );
  const command = `yarn add ${dependenciesToInstall.join(' ')}${
    type === 'prod' ? '' : ' -D'
  }`;
  await executeCommandSimple(projectPath, command);

  if (dependencies.length === 1 && dependencies[0]) {
    return getYarnPackageWithInfo(projectPath, dependencies[0].name);
  }

  return undefined;
};

export const addDependenciesProcedure = projectProcedure
  .input(
    z.object({
      dependencies: z.array(
        z.object({
          name: z.string(),
          version: z.string().optional(),
        }),
      ),
      type: z.enum(['prod', 'dev']),
    }),
  )
  .mutation(
    async ({
      ctx: { xCacheId, projectPath, manager },
      input: { dependencies, type },
    }) => {
      let singleAddUpdate: DependencyInstalled | undefined = undefined;

      if (manager === 'yarn') {
        singleAddUpdate = await addYarnDependencies(
          projectPath,
          dependencies,
          type,
        );
      } else if (manager === 'pnpm') {
        singleAddUpdate = await addPnpmDependencies(
          projectPath,
          dependencies,
          type,
        );
      } else {
        singleAddUpdate = await addNpmDependencies(
          projectPath,
          dependencies,
          type,
        );
      }

      if (singleAddUpdate) {
        updateInCache(xCacheId + manager + projectPath, singleAddUpdate);
      } else {
        clearCache(xCacheId + manager + projectPath);
      }

      return {};
    },
  );
