import * as fs from 'fs';
import * as path from 'path';

export function hasYarn(projectPath:string):boolean {
  return fs.existsSync(path.join(projectPath, 'yarn.lock'));
}
