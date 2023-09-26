import { z } from 'zod';

import { projectProcedure } from '../../../trpc/trpc-router';
import type { Basic, Type } from '../../../types/dependency.types';
import { spliceFromCache } from '../../../utils/cache';
import { executeCommandSimple } from '../../execute-command';

const commandTypeFlag = {
  prod: '-S',
  dev: '-D',
  global: '-g',
  extraneous: '',
};

const removeNpmDependencies = async (
  projectPath: string | undefined,
  dependencies: Basic[],
  type: Type,
): Promise<void> => {
  // remove
  await executeCommandSimple(
    projectPath,
    `npm uninstall ${dependencies.map((d) => d.name).join(' ')} ${
      commandTypeFlag[type]
    }`,
  );
};

const removePnpmDependencies = async (
  projectPath: string | undefined,
  dependencies: Basic[],
): Promise<void> => {
  // remove
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

const removeYarnDependencies = async (
  projectPath: string | undefined,
  dependencies: Basic[],
): Promise<void> => {
  // remove
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

export const removeDependenciesProcedure = projectProcedure
  .input(
    z.object({
      dependencies: z.array(
        z.object({
          name: z.string(),
        }),
      ),
      type: z.enum(['prod', 'dev']),
    }),
  )
  .mutation(
    async ({
      input: { projectPath, dependencies, type },
      ctx: { manager, xCacheId },
    }) => {
      console.log(projectPath, dependencies, type);
      if (manager === 'yarn') {
        await removeYarnDependencies(projectPath, dependencies);
      } else if (manager === 'pnpm') {
        await removePnpmDependencies(projectPath, dependencies);
      } else {
        await removeNpmDependencies(projectPath, dependencies, type);
      }

      for (const dependency of dependencies) {
        spliceFromCache(xCacheId + manager + projectPath, dependency.name);
      }

      return {};
    },
  );
