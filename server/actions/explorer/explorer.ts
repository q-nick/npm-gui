import * as path from 'path';
import * as fs from 'fs';
import type { Response, Request } from 'express';
import { decodePath } from '../../middlewares/projectPathAndNpmYarnMiddleware';

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

export function explorer(
  req: Request<API['Request']>,
  res: Response<API['Response']>,
): void {
  let normalizedPath = req.params.path !== undefined
    ? path.normalize(decodePath(req.params.path)) : null;

  let changed = false;

  if (normalizedPath === null || !fs.existsSync(normalizedPath)) {
    normalizedPath = process.cwd();
    changed = true;
  }

  const ls = fs.readdirSync(normalizedPath)
    .map((name) => ({
      name,
      isDirectory: fs.lstatSync(`${normalizedPath}/${name}`).isDirectory(),
      isProject: ['package.json', 'package-lock.json', 'yarn.lock'].includes(name),
    }));

  res.json({
    ls,
    changed,
    path: normalizedPath,
  });
}
