import path from 'path';
import fs from 'fs';
import { decodePath } from '../decodePath';

export async function explorer(req, res) {
  let normalizedPath = req.params.path ? path.normalize(decodePath(req.params.path)) : null;
  let changed = false;
  if (!normalizedPath || !fs.existsSync(normalizedPath)) {
    normalizedPath = process.cwd();
    changed = true;
  }

  const ls = fs.readdirSync(normalizedPath)
    .map(name => ({
      isDirectory: fs.lstatSync(`${normalizedPath}/${name}`).isDirectory(),
      name,
      isProject: ['package.json', 'package-lock.json', 'yarn.lock', 'bower.json'].includes(name),
    }));

  res.json({
    path: normalizedPath,
    ls,
    changed,
  });
}
