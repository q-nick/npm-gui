import type { Type } from '../../../types/dependency.types';
import type { ResponserFunction } from '../../../types/new-server.types';
import { spliceFromCache } from '../../../utils/cache';
import { executeCommandSimple } from '../../execute-command';

const commandTypeFlag = {
  prod: '-S',
  dev: '-D',
  global: '-g',
  extraneous: '',
};

const deleteNpmDependency = async (
  projectPath: string | undefined,
  packageName: string,
  type: Type,
): Promise<void> => {
  // delete
  await executeCommandSimple(
    projectPath,
    `npm uninstall ${packageName} ${commandTypeFlag[type]}`,
  );
};

const deletePnpmDependency = async (
  projectPath: string | undefined,
  packageName: string,
): Promise<void> => {
  // delete
  try {
    await executeCommandSimple(projectPath, `pnpm uninstall ${packageName}`);
  } catch (error: unknown) {
    // we are caching error it's unimportant in yarn
    if (!process.env['NODE_TEST']) {
      console.log(error);
    }
  }
};

const deleteYarnDependency = async (
  projectPath: string | undefined,
  packageName: string,
): Promise<void> => {
  // delete
  try {
    await executeCommandSimple(projectPath, `yarn remove ${packageName}`);
  } catch (error: unknown) {
    // we are caching error it's unimportant in yarn
    if (!process.env['NODE_TEST']) {
      console.log(error);
    }
  }
};

interface Parameters {
  type: string;
  dependencyName: string;
}

export const deleteDependency: ResponserFunction<unknown, Parameters> = async ({
  params: { type, dependencyName },
  extraParams: { projectPathDecoded, manager, xCacheId },
}) => {
  if (manager === 'yarn') {
    await deleteYarnDependency(projectPathDecoded, dependencyName);
  } else if (manager === 'pnpm') {
    await deletePnpmDependency(projectPathDecoded, dependencyName);
  } else {
    await deleteNpmDependency(projectPathDecoded, dependencyName, type as any);
  }

  spliceFromCache(xCacheId + projectPathDecoded, dependencyName);

  return {};
};
