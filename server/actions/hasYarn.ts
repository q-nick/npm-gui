import * as fs from 'fs';
import * as path from 'path';

export function hasYarn(projectPath:string):boolean {
  return fs.existsSync(path.join(projectPath, 'yarn.lock'));
}

export function hasNpm(projectPath:string):boolean {
  return fs.existsSync(path.join(projectPath, 'package.json'));
}
