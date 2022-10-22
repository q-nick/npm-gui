import { existsSync, unlinkSync } from 'fs';
import path from 'path';

import type { Manager } from '../../../types/dependency.types';
import type { ResponserFunction } from '../../../types/new-server.types';
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

export const installDependenciesForceManager: ResponserFunction<
  unknown,
  { forceManager: Manager }
> = async ({
  params: { forceManager },
  extraParams: { projectPathDecoded, xCacheId },
}) => {
  clearManagerFiles(projectPathDecoded);

  await executeCommandSimple(projectPathDecoded, `${forceManager} install`);

  clearCache(xCacheId + forceManager + projectPathDecoded);

  return {};
};

export const installDependencies: ResponserFunction = async ({
  extraParams: { projectPathDecoded, manager = 'npm', xCacheId },
}) => {
  await executeCommandSimple(projectPathDecoded, `${manager} install`);

  clearCache(xCacheId + manager + projectPathDecoded);

  return {};
};
