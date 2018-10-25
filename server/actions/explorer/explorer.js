import path from 'path';
import fs from 'fs';
import { decodePath } from '../decodePath';

export async function explorer(req, res) {
  const normalizedPath = path.normalize(req.params.path ? `${decodePath(req.params.path)}` : process.cwd());

  const ls = fs.readdirSync(normalizedPath)
    .map(name => ({
      isDirectory: fs.lstatSync(`${normalizedPath}/${name}`).isDirectory(),
      name,
      isProject: ['package.json', 'package-lock.json', 'yarn.lock', 'bower.json'].includes(name),
    }));

  res.json({
    path: normalizedPath,
    ls,
  });
}
