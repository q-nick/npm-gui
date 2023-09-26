import { existsSync, unlinkSync } from 'fs';
import path from 'path';
import z from 'zod';

import { projectProcedure } from '../../../trpc/trpc-router';
import { clearCache } from '../../../utils/cache';
import { deleteFolderRecursive } from '../../../utils/delete-folder-resursive';
import { executeCommandSimple } from '../../execute-command';

const clearManagerFiles = (projectPath: string): void => {
  if (existsSync(`${path.normalize(projectPath)}/node_modules`)) {
    deleteFolderRecursive(`${path.normalize(projectPath)}/node_modules`);
  }

  for (const fileName of ['yarn.lock', 'package-lock.json', 'pnpm-lock.yaml']) {
    if (existsSync(`${path.normalize(projectPath)}/${fileName}`)) {
      unlinkSync(`${path.normalize(projectPath)}/${fileName}`);
    }
  }
};

export const installDependenciesProcedure = projectProcedure
  .input(
    z.object({
      forceManager: z.string().optional(),
    }),
  )
  .mutation(
    async ({
      ctx: { xCacheId, projectPath, manager },
      input: { forceManager },
    }) => {
      if (forceManager) {
        clearManagerFiles(projectPath);
      }

      await executeCommandSimple(
        projectPath,
        `${forceManager || manager} install`,
      );

      clearCache(xCacheId + (forceManager || manager) + projectPath);

      return {};
    },
  );
