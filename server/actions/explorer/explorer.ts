import { existsSync, lstatSync, readdirSync } from 'fs';
import { normalize } from 'path';

import { decodePath } from '../../middlewares/projectPathAndManagerMiddleware';
import type { ResponserFunction } from '../../newServerTypes';

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

export const explorer: ResponserFunction = ({ params }) => {
  let normalizedPath =
    params.path !== undefined ? normalize(decodePath(params.path)) : null;

  let changed = false;

  if (normalizedPath === null || !existsSync(normalizedPath)) {
    normalizedPath = process.cwd();
    changed = true;
  }

  const ls = readdirSync(normalizedPath).map((name) => ({
    name,
    isDirectory: lstatSync(`${normalizedPath!}/${name}`).isDirectory(),
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
