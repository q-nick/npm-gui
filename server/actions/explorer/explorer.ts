import { existsSync, lstatSync, readdirSync } from 'fs';
import path from 'path';

import { decodePath } from '../../middlewares/project-path-and-manager.middleware';
import type {
  ExplorerRequest,
  ExplorerResponse,
} from '../../types/global.types';
import type { ResponserFunction } from '../../types/new-server.types';

export const explorer: ResponserFunction<
  unknown,
  ExplorerRequest,
  ExplorerResponse
> = ({ params }) => {
  let normalizedPath =
    params.path !== undefined ? path.normalize(decodePath(params.path)) : null;

  let changed = false;

  if (normalizedPath === null || !existsSync(normalizedPath)) {
    normalizedPath = process.cwd();
    changed = true;
  }

  const ls = readdirSync(normalizedPath).map((name) => ({
    name,
    isDirectory: lstatSync(`${normalizedPath}/${name}`).isDirectory(),
    isProject: [
      'package.json',
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml',
    ].includes(name),
  }));

  return {
    ls,
    changed,
    path: normalizedPath,
  };
};
