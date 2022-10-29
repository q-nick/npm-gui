import type { Basic, Type } from '../../../types/dependency.types';
import type { ResponserFunction } from '../../../types/new-server.types';
import { spliceFromCache } from '../../../utils/cache';
import { executeCommandSimple } from '../../execute-command';

const commandTypeFlag = {
  prod: '-S',
  dev: '-D',
  global: '-g',
  extraneous: '',
};

const deleteNpmDependencies = async (
  projectPath: string | undefined,
  dependencies: Basic[],
  type: Type,
): Promise<void> => {
  // delete
  console.log(dependencies);
  await executeCommandSimple(
    projectPath,
    `npm uninstall ${dependencies.map((d) => d.name).join(' ')} ${
      commandTypeFlag[type]
    }`,
  );
};

const deletePnpmDependencies = async (
  projectPath: string | undefined,
  dependencies: Basic[],
): Promise<void> => {
  // delete
  try {
    await executeCommandSimple(
      projectPath,
      `pnpm uninstall ${dependencies.map((d) => d.name).join(' ')}`,
    );
  } catch (error: unknown) {
    // we are caching error it's unimportant in yarn
    if (!process.env['NODE_TEST']) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }
};

const deleteYarnDependencies = async (
  projectPath: string | undefined,
  dependencies: Basic[],
): Promise<void> => {
  // delete
  try {
    await executeCommandSimple(
      projectPath,
      `yarn remove ${dependencies.map((d) => d.name).join(' ')}`,
    );
  } catch (error: unknown) {
    // we are caching error it's unimportant in yarn
    if (!process.env['NODE_TEST']) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }
};

interface Parameters {
  type: Type;
  dependencyName: string;
}

export const deleteDependencies: ResponserFunction<
  { name: string }[],
  Parameters
> = async ({
  params: { type },
  extraParams: { projectPathDecoded, manager, xCacheId },
  body,
}) => {
  if (manager === 'yarn') {
    await deleteYarnDependencies(projectPathDecoded, body);
  } else if (manager === 'pnpm') {
    await deletePnpmDependencies(projectPathDecoded, body);
  } else {
    await deleteNpmDependencies(projectPathDecoded, body, type);
  }

  for (const dependency of body) {
    spliceFromCache(xCacheId + manager + projectPathDecoded, dependency.name);
  }

  return {};
};
