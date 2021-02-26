import * as path from 'path';
import * as fs from 'fs';
import type {Response, Request} from 'express';
import { decodePath } from '../decodePath';

interface Explorer {
  ls: {}[]; // TODO FileOrFolder
  path: string;
  changed: boolean;
}

export function explorer(
  req: Request<{path?: string}>,
  res: Response<Explorer>
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
