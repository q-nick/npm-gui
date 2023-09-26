import { initTRPC, TRPCError } from '@trpc/server';
import z from 'zod';

import {
  isNpmProject,
  isPnpmProject,
  isYarnProject,
} from '../middlewares/project-path-and-manager.middleware';
import type { Manager } from '../types/dependency.types';

export const {
  router,
  procedure: publicProcedure,
  middleware,
} = initTRPC.context().create();

export const projectProcedure = publicProcedure
  .input(z.object({ projectPath: z.string(), xCacheId: z.string() }))
  .use(async (options) => {
    // const projectPathDecoded = decodePath(options.input.projectPath);

    const isYarn = isYarnProject(options.input.projectPath);
    const isNpm = isNpmProject(options.input.projectPath);
    const isPnpm = isPnpmProject(options.input.projectPath);

    if (!isYarn && !isNpm && !isPnpm) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'invalid project structure!',
      });
    }

    // default
    let manager: Manager = 'npm';

    if (isPnpm) {
      // special
      manager = 'pnpm';
    } else if (isYarn) {
      manager = 'yarn';
    }

    return options.next({
      ctx: { projectPath: options.input.projectPath, manager, xCacheId: 'any' },
    });
  });
