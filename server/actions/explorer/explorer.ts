import { existsSync, lstatSync, readdirSync } from 'fs';
import path from 'path';

import { decodePath } from '../../middlewares/project-path-and-manager.middleware';
import type { ResponserFunction } from '../../types/new-server.types';

export interface FileOrFolder {
  name: string;
  isDirectory: boolean;
  isProject: boolean;
}
export interface Explorer {
  ls: FileOrFolder[];
  path: string;
  changed: boolean;
}

export interface API {
  Request: { path?: string };
  Response: Explorer;
}

interface Parameters {
  path?: string;
}

export const explorer: ResponserFunction<unknown, Parameters> = ({
  params,
}) => {
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
    isProject: ['package.json', 'package-lock.json', 'yarn.lock'].includes(
      name,
    ),
  }));

  return {
    ls,
    changed,
    path: normalizedPath,
  };
};
