import * as fs from 'fs';
import * as path from 'path';

import { parseJSON } from './parseJSON';

export function getProjectPackageJSON(projectPath: string):any {
  const packageJSONpath = path.join(projectPath, 'package.json');
  if (fs.existsSync(packageJSONpath)) {
    return parseJSON(fs.readFileSync(packageJSONpath, { encoding: 'utf8' }));
  }

  return null;
}

export function getProjectBowerJSON(projectPath: string):any {
  const bowerJSONpath = path.join(projectPath, 'bower.json');
  if (fs.existsSync(bowerJSONpath)) {
    return parseJSON(fs.readFileSync(bowerJSONpath, { encoding: 'utf8' }));
  }

  return null;
}
