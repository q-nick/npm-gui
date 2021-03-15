import * as path from 'path';
import * as fs from 'fs';
import { decodePath } from '../../middlewares/projectPathAndNpmYarnMiddleware';
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
  let normalizedPath = params.path !== undefined
    ? path.normalize(decodePath(params.path)) : null;

  let changed = false;

  if (normalizedPath === null || !fs.existsSync(normalizedPath)) {
    normalizedPath = process.cwd();
    changed = true;
  }

  const ls = fs.readdirSync(normalizedPath)
    .map((name) => ({
      name,
      isDirectory: fs.lstatSync(`${normalizedPath!}/${name}`).isDirectory(),
      isProject: ['package.json', 'package-lock.json', 'yarn.lock'].includes(name),
    }));

  return {
    ls,
    changed,
    path: normalizedPath,
  };
};
